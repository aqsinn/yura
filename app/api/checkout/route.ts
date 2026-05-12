// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

const VALID_TIERS = ['starter', 'pro', 'sigma', 'alpha'] as const
type PaidTier = typeof VALID_TIERS[number]

export async function POST(req: Request) {
  try {
    const { productId, interval, tier } = await req.json()

    // Validate tier is a known paid tier
    if (!VALID_TIERS.includes(tier as PaidTier)) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 })
    }

    const stripe = getStripe()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const billingInterval = interval === 'year' ? 'year' : 'month'
    const prices = await stripe.prices.list({ product: productId, active: true })
    const price = prices.data.find(p => p.recurring?.interval === billingInterval)
    if (!price) return NextResponse.json({ error: `No ${billingInterval} price found` }, { status: 400 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    let customerId = profile?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabaseUUID: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const origin = req.headers.get('origin')
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/profile?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/profile?canceled=true`,
      // Store BOTH userId and tier — confirm-payment reads these directly, no env var matching needed
      metadata: { userId: user.id, tier },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('[checkout]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
