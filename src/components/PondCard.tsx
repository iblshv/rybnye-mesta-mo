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
};

export function PondCard({ pond, compact = false }: PondCardProps) {
  const image = pond.images[0] ?? "/images/placeholders/pond-1.svg";
  const isPriority = isPriorityPond(pond);

  return (
    <article className="group overflow-hidden rounded-2xl border border-pine-900/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <Link className="block" href={`/ponds/${pond.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-pine-50">
          <Image
            alt={`Водоём ${pond.name}`}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={withBasePath(image)}
            unoptimized={image.endsWith(".svg")}
          />
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-pine-900 shadow-sm">
            {pond.distanceFromMkad} км от МКАД
          </div>
          {isPriority ? (
            <div className="absolute right-3 top-3 rounded-full bg-sand-100/95 px-3 py-1 text-xs font-bold text-pine-900 shadow-sm">
              Приоритетное размещение
            </div>
          ) : null}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/ponds/${pond.slug}`}>
              <h3 className="text-xl font-bold text-pine-900 transition group-hover:text-pine-700">
                {pond.name}
              </h3>
            </Link>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {pond.district}, {pond.direction}
            </p>
          </div>
          <div className="rounded-xl bg-sand-100 px-3 py-2 text-right">
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

        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-pine-700" aria-hidden="true" />
            {pond.lastStocking
              ? `${formatDate(pond.lastStocking.date)} - ${pond.lastStocking.fish}`
              : "Зарыбление уточняется"}
          </div>
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-pine-700" aria-hidden="true" />
            {pond.services.slice(0, 3).join(", ")}
          </div>
          <div className="flex items-center gap-2">
            <Fish className="h-4 w-4 text-pine-700" aria-hidden="true" />
            {pond.fish.length} вида рыбы
          </div>
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            size: "md",
            className: "mt-5 w-full"
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
