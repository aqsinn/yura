import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import ProfileForm from './ProfileForm'
import PricingBanner from '@/app/components/profile/PricingBanner'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { saved, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Your profile</h1>
        {user && (
          <Link
            href={`/profile/${user.id}`}
            className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-50"
          >
            View public profile
          </Link>
        )}
      </div>

      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">
          Saved successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 break-words">
          {error}
        </div>
      ) : null}

      <section id="pricing" className="scroll-mt-24">
        <PricingBanner />
      </section>

      <section className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">Edit profile</h2>
        {user && profile && <ProfileForm defaultValues={profile} />}
      </section>
    </div>
  )
}
