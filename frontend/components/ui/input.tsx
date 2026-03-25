export function InputField({
  icon, label, placeholder, value, onChange, type = 'text', min, required,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#046207] mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#06930A]">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          required={required}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#CEFDCF] bg-[#F5FFF5] text-[#023103] focus:outline-none focus:border-[#08C40E] transition-colors placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}