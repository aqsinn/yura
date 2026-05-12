import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { priceId, productId, interval } = await req.json()
    const stripe = getStripe()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const billingInterval: 'month' | 'year' =
      interval === 'year' ? 'year' : 'month'

    let resolvedPriceId: string | null = null

    if (typeof priceId === 'string' && priceId.startsWith('price_')) {
      resolvedPriceId = priceId
    }

    if (!resolvedPriceId && typeof productId === 'string' && productId.startsWith('prod_')) {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 100,
      })

      const match = prices.data.find((p) => {
        if (p.type !== 'recurring') return false
        if (!p.recurring) return false
        return p.recurring.interval === billingInterval
      })

      resolvedPriceId = match?.id ?? null
    }

    if (!resolvedPriceId) {
      return new NextResponse(
        billingInterval === 'year'
          ? 'No yearly price configured for this plan'
          : 'No monthly price configured for this plan',
        { status: 400 }
      )
    }

    // Get or create customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name, id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || user.email,
        metadata: {
          supabaseUUID: user.id,
        },
      })
      customerId = customer.id
      
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const origin = req.headers.get('origin')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin
    if (!siteUrl) {
      return new NextResponse('Missing NEXT_PUBLIC_SITE_URL', { status: 500 })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/profile?success=true`,
      cancel_url: `${siteUrl}/profile?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
