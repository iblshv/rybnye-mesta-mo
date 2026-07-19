import { CalendarDays, Fish } from "lucide-react";
import type { Pond } from "@/data/ponds";
import { formatDate } from "@/lib/utils";

export function StockingList({ ponds }: { ponds: Pond[] }) {
  return (
    <div className="grid gap-3">
      {ponds.map((pond) => (
        <article
          className="grid gap-3 rounded-2xl border border-pine-900/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center"
          key={pond.id}
        >
          <div className="min-w-0">
            <h3 className="break-words font-bold text-pine-900">{pond.name}</h3>
            <p className="mt-1 flex min-w-0 items-start gap-2 text-sm leading-6 text-slate-600">
              <Fish className="mt-1 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {pond.lastStocking?.fish ?? "рыба уточняется"}
                {pond.lastStocking?.amount ? `, ${pond.lastStocking.amount}` : ""}
              </span>
            </p>
          </div>
          <div className="flex min-h-11 items-center gap-2 rounded-xl bg-pine-50 px-3 py-2 text-sm font-semibold text-pine-900">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(pond.lastStocking?.date)}
          </div>
        </article>
      ))}
    </div>
  );
}
