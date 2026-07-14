export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];
  return (
    <div
      className={`${sizeClass} border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}
    />
  );
}
