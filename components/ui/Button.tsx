//A reusable button
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
};

export default function Button({ children, onClick, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 w-full rounded-xl border border-[#ffe7a3]/70 bg-[#f59f00] py-3 text-sm font-semibold text-[#1e1400] transition disabled:opacity-70"
    >
      {loading ? "Loading..." : children}
    </button>
  );
}