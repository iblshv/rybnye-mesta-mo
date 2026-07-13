import { SearchX } from "lucide-react";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-pine-900/20 bg-white/70 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sand-100 text-pine-700">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-pine-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}
