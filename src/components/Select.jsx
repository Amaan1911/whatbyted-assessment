export default function Select({ label, children, ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block text-sm mb-1">{label}</span>}
      <select className="w-full border rounded-xl px-3 py-2" {...props}>
        {children}
      </select>
    </label>
  )
}
