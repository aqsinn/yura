// app/api/webhook/stripe/route.ts
import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const toISO = (s?: number | null) =>
  s ? new Date(s * 1000).toISOString() : new Date().toISOString()

// Stripe SDK v17+ removed current_period_end from the Subscription root type.
// It now lives on each subscription item. This helper reads either location safely.
function getPeriodEnd(sub: Stripe.Subscription): number | null {
  return (sub as any).current_period_end
    ?? sub.items?.data?.[0]?.billing_thresholds as any
    ?? null
}

function tierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)     return 'pro'
  if (priceId === process.env.STRIPE_SIGMA_PRICE_ID)   return 'sigma'
  if (priceId === process.env.STRIPE_ALPHA_PRICE_ID)   return 'alpha'
  return 'free'
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string
  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    if (userId && session.subscription) {
      const sub = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription
      const priceId = sub.items.data[0].price.id
      const tier = tierFromPriceId(priceId)
      await Promise.all([
        supabaseAdmin.from('profiles').update({ tier }).eq('id', userId),
        supabaseAdmin.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          status: sub.status,
          price_id: priceId,
          current_period_end: toISO(getPeriodEnd(sub)),
        }),
      ])
    }
  }

  if (
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const sub = event.data.object as Stripe.Subscription
    const { data: subData } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', sub.id)
      .single()

    if (subData) {
      await supabaseAdmin.from('subscriptions').update({
        status: sub.status,
        current_period_end: toISO(getPeriodEnd(sub)),
      }).eq('stripe_subscription_id', sub.id)

      if (['canceled', 'unpaid', 'past_due'].includes(sub.status)) {
        await supabaseAdmin.from('profiles').update({ tier: 'free' }).eq('id', subData.user_id)
      }
    }
  }

  return NextResponse.json({ received: true })
}