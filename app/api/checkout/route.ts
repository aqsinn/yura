import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const { priceId, isAnnual } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
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

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?canceled=true`,
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
