export default function SkillTag({ label, category }: { label: string; category?: 'engineering' | 'design' | 'business' }) {
  const tagClass =
    category === 'design'
      ? 'tag-design'
      : category === 'business'
      ? 'tag-business'
      : 'tag-engineering'

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${tagClass}`}>
      {label}
    </span>
  )
}
