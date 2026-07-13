import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "green" | "blue" | "sand" | "gray";
  className?: string;
};

const toneClasses = {
  green: "bg-pine-50 text-pine-700 ring-pine-700/10",
  blue: "bg-water-500/10 text-water-700 ring-water-700/10",
  sand: "bg-sand-100 text-pine-900 ring-sand-200",
  gray: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({ children, tone = "green", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
