import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Fish, MapPin, WalletCards } from "lucide-react";
import { isPriorityPond, type Pond } from "@/data/ponds";
import { withBasePath } from "@/lib/site";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "./Badge";
import { buttonVariants } from "./ui/button";

type PondCardProps = {
  pond: Pond;
  compact?: boolean;
  priority?: boolean;
};

export function PondCard({ pond, compact = false, priority = false }: PondCardProps) {
  const image = pond.images[0] ?? "/images/placeholders/pond-1.svg";
  const isPriority = isPriorityPond(pond);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link className="block" href={`/ponds/${pond.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-pine-50">
          <Image
            alt={`Водоём ${pond.name}`}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={withBasePath(image)}
            unoptimized={image.endsWith(".svg")}
          />
          <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            <div className="max-w-full rounded-full bg-white/90 px-3 py-1 text-xs font-bold leading-5 text-pine-900 shadow-sm">
              {pond.distanceFromMkad} км от МКАД
            </div>
            {isPriority ? (
              <div className="max-w-full rounded-full bg-sand-100/95 px-3 py-1 text-xs font-bold leading-5 text-pine-900 shadow-sm">
                Приоритетное размещение
              </div>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/ponds/${pond.slug}`}>
              <h3 className="break-words text-xl font-bold leading-7 text-pine-900 transition group-hover:text-pine-700">
                {pond.name}
              </h3>
            </Link>
            <p className="mt-1 flex min-w-0 items-start gap-1 text-sm leading-5 text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 break-words">
                {pond.district}, {pond.direction}
              </span>
            </p>
          </div>
          <div className="shrink-0 rounded-xl bg-sand-100 px-3 py-2 text-right">
            <div className="text-xs font-semibold text-slate-500">от</div>
            <div className="text-sm font-bold text-pine-900">
              {formatPrice(pond.priceFrom)}
            </div>
          </div>
        </div>

        {!compact ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
            {pond.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {pond.fish.slice(0, compact ? 3 : 5).map((fish) => (
            <Badge key={fish} tone="green">
              {fish}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid min-w-0 gap-2 pb-5 text-sm leading-5 text-slate-600">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
            <span className="min-w-0 break-words">
              {pond.lastStocking
                ? `${formatDate(pond.lastStocking.date)} - ${pond.lastStocking.fish}`
                : "Зарыбление уточняется"}
            </span>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <WalletCards className="mt-0.5 h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
            <span className="min-w-0 break-words">
              {pond.services.slice(0, 3).join(", ") || "Услуги уточняются"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Fish className="h-4 w-4 shrink-0 text-pine-700" aria-hidden="true" />
            {pond.fish.length} вида рыбы
          </div>
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            size: "md",
            className: "mt-auto w-full"
          })}
          href={`/ponds/${pond.slug}`}
        >
          Подробнее
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
