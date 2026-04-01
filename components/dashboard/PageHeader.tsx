type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-white/70">{subtitle}</p>
      ) : null}
    </div>
  );
}
