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

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId } = await req.json()
    const stripe = getStripe()

    // Retrieve the exact checkout session Stripe redirected from
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    // Verify this session belongs to the logged-in user
    if (session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: 'Session mismatch' }, { status: 403 })
    }

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.json({ tier: 'free', status: session.payment_status })
    }

    const sub = session.subscription as any
    if (!sub) return NextResponse.json({ tier: 'free' })

    const priceId = sub.items?.data?.[0]?.price?.id
    const tier = tierFromPriceId(priceId)
    const periodEnd = sub.current_period_end

    await Promise.all([
      supabaseAdmin.from('profiles').update({ tier }).eq('id', user.id),
      supabaseAdmin.from('subscriptions').upsert({
        user_id: user.id,
        stripe_subscription_id: sub.id,
        status: sub.status,
        price_id: priceId,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : new Date().toISOString(),
      }),
    ])

    return NextResponse.json({ tier })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[confirm-payment]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
