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

    const billingInterval: 'month' | 'year' = interval === 'year' ? 'year' : 'month'
    let resolvedPriceId: string | null = null

    // 1. Resolve Price ID
    if (typeof priceId === 'string' && priceId.startsWith('price_')) {
      resolvedPriceId = priceId
    }

    if (!resolvedPriceId && typeof productId === 'string' && productId.startsWith('prod_')) {
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 10,
      })
      const match = prices.data.find((p) => p.recurring?.interval === billingInterval)
      resolvedPriceId = match?.id ?? null
    }

    if (!resolvedPriceId) {
      return new NextResponse('Price configuration missing', { status: 400 })
    }

    // 2. Get or create customer (using maybeSingle to prevent 500 crash)
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', user.id)
      .maybeSingle()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || user.email || 'Customer',
        metadata: { supabaseUUID: user.id },
      })
      customerId = customer.id
      
      await supabase
        .from('profiles')
        .upsert({ id: user.id, stripe_customer_id: customerId })
    }

    // 3. Robust URL Handling
    const origin = req.headers.get('origin')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || 'https://yuraa.vercel.app'

    // 4. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${siteUrl}/profile?success=true`,
      cancel_url: `${siteUrl}/profile?canceled=true`,
      metadata: { userId: user.id },
      customer_update: { address: 'auto' },
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}