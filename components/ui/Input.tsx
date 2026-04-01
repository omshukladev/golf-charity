// A reusable input field

type Props = {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/80">{label}</span>
      <input
        suppressHydrationWarning
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white"
      />
    </label>
  );
}
