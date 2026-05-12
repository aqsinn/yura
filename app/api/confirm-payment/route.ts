// app/api/confirm-payment/route.ts
import { NextResponse } from 'next/server'
import { getStripe } from '@/utils/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { sessionId } = await req.json()
    if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

    const stripe = getStripe()

    // Retrieve the exact checkout session with subscription expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    console.log('[confirm-payment] session.payment_status:', session.payment_status)
    console.log('[confirm-payment] session.metadata:', session.metadata)

    // Security: make sure this session belongs to the logged-in user
    if (session.metadata?.userId !== user.id) {
      return NextResponse.json({ error: 'Session does not belong to this user' }, { status: 403 })
    }

    // Read tier directly from metadata — no price ID env var matching
    const tier = session.metadata?.tier
    if (!tier || tier === 'free') {
      return NextResponse.json({ error: 'No tier in session metadata', tier: 'free' }, { status: 200 })
    }

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      console.log('[confirm-payment] Payment not complete yet:', session.payment_status)
      return NextResponse.json({ tier: 'free', pending: true })
    }

    const sub = session.subscription as any
    const priceId = sub?.items?.data?.[0]?.price?.id ?? null
    const periodEnd = sub?.current_period_end ?? null

    // Write tier to DB using admin client (bypasses RLS)
    const [profileResult, subResult] = await Promise.all([
      supabaseAdmin.from('profiles').update({ tier }).eq('id', user.id),
      sub ? supabaseAdmin.from('subscriptions').upsert({
        user_id: user.id,
        stripe_subscription_id: sub.id,
        status: sub.status,
        price_id: priceId,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : new Date().toISOString(),
      }) : Promise.resolve({ error: null }),
    ])

    if (profileResult.error) {
      console.error('[confirm-payment] Profile update error:', profileResult.error)
      return NextResponse.json({ error: profileResult.error.message }, { status: 500 })
    }

    console.log('[confirm-payment] Successfully set tier:', tier, 'for user:', user.id)
    return NextResponse.json({ tier })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[confirm-payment] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
