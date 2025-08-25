export default function Input({ label, error, ...props }) {
  return (
    <label className="block mb-3">
      {label && <span className="block text-sm mb-1">{label}</span>}
      <input
        className="w-full border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}
