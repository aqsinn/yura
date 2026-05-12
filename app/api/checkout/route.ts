import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { productId, interval } = await req.json()
    const stripe = getStripe()
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const billingInterval = interval === 'year' ? 'year' : 'month'

    // 1. Fetch the price from Stripe
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    })

    const price = prices.data.find((p) => p.recurring?.interval === billingInterval)

    if (!price) {
      return NextResponse.json(
        { error: `No ${billingInterval} price found for product ${productId}` }, 
        { status: 400 }
      )
    }

    // 2. Get/Create Customer
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
      
      await supabase
        .from('profiles')
        .upsert({ id: user.id, stripe_customer_id: customerId })
    }

    // 3. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price.id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/profile?success=true`,
      cancel_url: `${req.headers.get('origin')}/profile?canceled=true`,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}