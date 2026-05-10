type OfferItemProps = {
  title: string
  description: string
  status: string
}

export default function OfferItem({ title, description, status }: OfferItemProps) {
  return (
    <div className="card p-5">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-slate-600 text-sm mt-1">{description}</p>
      <span className="text-xs text-indigo-700 mt-3 inline-block">{status}</span>
    </div>
  )
}
