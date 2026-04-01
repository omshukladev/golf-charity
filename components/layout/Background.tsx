export default function Background() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#45b394]/30 blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-[#f59f00]/25 blur-3xl" />
    </div>
  );
}