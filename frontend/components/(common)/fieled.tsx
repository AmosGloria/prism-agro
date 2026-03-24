
interface FieldProps {
  id: string
  label: string
  icon: React.ReactNode
  error?: string
  children: React.ReactNode
}

const Field = ({ label, id, icon, error, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-gray-900">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center">
        {icon}
      </span>
      {children}
    </div>
    {error && (
      <p className="text-xs text-red-500">{error}</p>
    )}
  </div>
)

export default Field