// app/api/confirm-payment/route.ts
import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function tierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID)     return 'pro'
  if (priceId === process.env.STRIPE_SIGMA_PRICE_ID)   return 'sigma'
  if (priceId === process.env.STRIPE_ALPHA_PRICE_ID)   return 'alpha'
  return 'free'
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 })
    }

    const stripe = getStripe()

    // Get the most recent active subscription for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (!subscriptions.data.length) {
      // Try trialing too
      const trialing = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'trialing',
        limit: 1,
      })
      if (!trialing.data.length) {
        return NextResponse.json({ tier: 'free' })
      }
      subscriptions.data.push(...trialing.data)
    }

    const sub = subscriptions.data[0]
    const priceId = sub.items.data[0].price.id
    const tier = tierFromPriceId(priceId)
    const periodEnd = (sub as any).current_period_end

    // Update both tables immediately — no webhook needed
    await Promise.all([
      supabaseAdmin.from('profiles').update({ tier }).eq('id', user.id),
      supabaseAdmin.from('subscriptions').upsert({
        user_id: user.id,
        stripe_subscription_id: sub.id,
        status: sub.status,
        price_id: priceId,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : new Date().toISOString(),
      }),
    ])

    return NextResponse.json({ tier })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
