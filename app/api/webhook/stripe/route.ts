import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Note: Use the service role key for admin access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === 'checkout.session.completed') {
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const userId = session.metadata?.userId

    if (userId) {
      let tier: 'free' | 'starter' | 'pro' = 'free'
      const priceId = subscription.items.data[0].price.id
      
      if (priceId === process.env.STRIPE_STARTER_PRICE_ID) tier = 'starter'
      if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = 'pro'

      await supabaseAdmin
        .from('profiles')
        .update({ tier })
        .eq('id', userId)

      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        price_id: priceId,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      })
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    
    const { data: subData } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subData) {
      await supabaseAdmin.from('subscriptions').update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }).eq('stripe_subscription_id', subscription.id)

      if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        await supabaseAdmin
          .from('profiles')
          .update({ tier: 'free' })
          .eq('id', subData.user_id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
