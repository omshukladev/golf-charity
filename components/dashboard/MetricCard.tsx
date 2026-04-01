type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
};

export default function MetricCard({
  label,
  value,
  hint,
  valueClassName = "text-[#ffe7a3]",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-white/55">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${valueClassName}`}>{value}</p>
      {hint ? <p className="mt-2 text-sm text-white/65">{hint}</p> : null}
    </div>
  );
}
