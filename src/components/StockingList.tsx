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
          <div>
            <h3 className="font-bold text-pine-900">{pond.name}</h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <Fish className="h-4 w-4 text-pine-700" aria-hidden="true" />
              {pond.lastStocking?.fish ?? "рыба уточняется"}
              {pond.lastStocking?.amount ? `, ${pond.lastStocking.amount}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-pine-50 px-3 py-2 text-sm font-semibold text-pine-900">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(pond.lastStocking?.date)}
          </div>
        </article>
      ))}
    </div>
  );
}
