import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Car,
  Coffee,
  ExternalLink,
  Fish,
  Flame,
  Home,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Tent,
  WalletCards,
  Wrench
} from "lucide-react";
import { Badge } from "@/components/Badge";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PondCard } from "@/components/PondCard";
import { StructuredData } from "@/components/StructuredData";
import { YandexMap } from "@/components/YandexMap";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  getPondBySlug,
  getPublishedPonds,
  getRecentStockings,
  getTicketFormats
} from "@/data/ponds";
import { formatDate, formatPrice, toPhoneHref } from "@/lib/utils";
import { breadcrumbJsonLd, pondJsonLd } from "@/lib/seo";
import { absoluteUrl, canonicalUrl, withBasePath } from "@/lib/site";

type PondPageProps = {
  params: {
    slug: string;
  };
};

const serviceIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Аренда снастей": Wrench,
  "Аренда садков": Wrench,
  "Аренда лодок": Wrench,
  Беседки: Tent,
  Мангал: Flame,
  Кафе: Coffee,
  Домики: Home,
  Парковка: Car,
  "Ночная рыбалка": Moon,
  "Детская зона": ShieldCheck,
  "Копчение рыбы": Flame
};

export function generateStaticParams() {
  return getPublishedPonds().map((pond) => ({
    slug: pond.slug
  }));
}

export function generateMetadata({ params }: PondPageProps): Metadata {
  const pond = getPondBySlug(params.slug);

  if (!pond) {
    return {
      title: "Водоём не найден"
    };
  }

  const title = `${pond.name} - платная рыбалка в Московской области`;
  const description = `${pond.description} Цена от ${formatPrice(
    pond.priceFrom
  )}, ${pond.distanceFromMkad} км от МКАД, рыба: ${pond.fish.join(", ")}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [absoluteUrl(pond.images[0])]
    },
    alternates: {
      canonical: canonicalUrl(`/ponds/${pond.slug}`)
    }
  };
}

export default function PondPage({ params }: PondPageProps) {
  const pond = getPondBySlug(params.slug);

  if (!pond) {
    notFound();
  }

  const image = pond.images[0] ?? "/images/placeholders/pond-1.svg";
  const related = getRecentStockings(4).filter((item) => item.id !== pond.id).slice(0, 3);
  const breadcrumbs = [
    { name: "Главная", path: "/" },
    { name: "Каталог водоёмов", path: "/ponds" },
    { name: pond.name, path: `/ponds/${pond.slug}` }
  ];

  return (
    <>
      <StructuredData data={[breadcrumbJsonLd(breadcrumbs), pondJsonLd(pond)]} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="bg-white py-8 md:py-12">
        <div className="container-page grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-pine-50 shadow-soft">
            <Image
              alt={`Платный водоём ${pond.name}`}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              src={withBasePath(image)}
              unoptimized={image.endsWith(".svg")}
            />
          </div>
          <div>
            <Badge tone={pond.isFeatured ? "sand" : "blue"}>
              {pond.isFeatured ? "Популярное место" : "Проверяется"}
            </Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-pine-900 sm:text-5xl">
              {pond.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">{pond.description}</p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <span className="flex items-center gap-2 rounded-xl bg-pine-50 px-4 py-3">
                <MapPin className="h-5 w-5 text-pine-700" aria-hidden="true" />
                {pond.district}, {pond.distanceFromMkad} км от МКАД
              </span>
              <span className="flex items-center gap-2 rounded-xl bg-sand-100 px-4 py-3">
                <WalletCards className="h-5 w-5 text-pine-700" aria-hidden="true" />
                от {formatPrice(pond.priceFrom)}
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                className={buttonVariants({ size: "lg" })}
                href={toPhoneHref(pond.phone)}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Позвонить
              </a>
              {pond.websiteUrl ? (
                <a
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                  href={pond.websiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Страница водоёма
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="grid gap-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Основная информация</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem label="Адрес" value={pond.address} />
                <InfoItem label="Направление" value={pond.direction} />
                <InfoItem label="График" value={pond.workingHours} />
                <InfoItem label="Телефон" value={pond.phone} />
                <InfoItem label="Цена" value={`от ${formatPrice(pond.priceFrom)}`} />
                {pond.websiteUrl ? (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Страница водоёма
                    </div>
                    <a
                      className="mt-1 inline-flex items-center gap-2 font-semibold text-pine-700 hover:text-pine-900"
                      href={pond.websiteUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Перейти на страницу
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                ) : null}
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Карта
                  </div>
                  <a
                    className="mt-1 inline-flex items-center gap-2 font-semibold text-pine-700 hover:text-pine-900"
                    href={pond.mapUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Открыть в Яндекс.Картах
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-sand-50 p-4">
                <h3 className="font-bold text-pine-900">Форматы путёвок</h3>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                  {getTicketFormats(pond).map((format) => (
                    <li className="flex gap-2" key={format}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pine-700" />
                      {format}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-pine-900">На карте</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Проверьте расположение водоёма, подъезд и ориентиры перед поездкой.
                  </p>
                </div>
                <a
                  className="inline-flex items-center gap-2 text-sm font-bold text-pine-700 hover:text-pine-900"
                  href={pond.mapUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Открыть в Яндекс.Картах
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <YandexMap
                center={pond.coordinates}
                fallbackUrl={pond.mapUrl}
                points={[
                  {
                    id: pond.id,
                    name: pond.name,
                    coordinates: pond.coordinates,
                    address: pond.address,
                    href: pond.mapUrl
                  }
                ]}
                zoom={11}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Какая рыба есть</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {pond.fish.map((fish) => (
                  <Badge key={fish} tone="green">
                    {fish}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Последнее зарыбление</h2>
              {pond.lastStocking ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <InfoPill
                    icon={CalendarDays}
                    label="Дата"
                    value={formatDate(pond.lastStocking.date)}
                  />
                  <InfoPill icon={Fish} label="Рыба" value={pond.lastStocking.fish} />
                  <InfoPill label="Объём" value={pond.lastStocking.amount} />
                  {pond.lastStocking.comment ? (
                    <p className="rounded-2xl bg-pine-50 p-4 text-sm leading-6 text-slate-700 sm:col-span-3">
                      {pond.lastStocking.comment}
                    </p>
                  ) : null}
                  <p className="text-xs leading-5 text-slate-500 sm:col-span-3">
                    Исторические данные. Перед поездкой уточните актуальное зарыбление
                    у администрации водоёма.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-slate-600">Информация уточняется.</p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Условия и правила</h2>
              <ul className="mt-4 grid gap-3">
                {pond.rules.map((rule) => (
                  <li className="flex gap-3 text-sm leading-6 text-slate-700" key={rule}>
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-pine-700" />
                    {rule}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Услуги</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {pond.services.map((service) => {
                  const Icon = serviceIconMap[service] ?? ShieldCheck;
                  return (
                    <div
                      className="flex items-center gap-3 rounded-2xl bg-pine-50 p-4 font-semibold text-pine-900"
                      key={service}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-pine-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      {service}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-pine-900">Что взять с собой</h2>
              <ul className="mt-4 grid gap-3">
                {pond.whatToBring.map((item) => (
                  <li className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pine-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {related.length > 0 ? (
              <div>
                <h2 className="mb-5 text-2xl font-bold text-pine-900">
                  Ещё водоёмы со свежими зарыблениями
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <PondCard compact key={item.id} pond={item} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="rounded-2xl border border-pine-900/10 bg-white p-6 shadow-soft lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-pine-900">Контакты водоёма</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Свяжитесь с администрацией напрямую и уточните цены, график и условия
              перед поездкой.
            </p>
            <div className="mt-5 grid gap-3">
              <a className={buttonVariants({ size: "lg", className: "w-full" })} href={toPhoneHref(pond.phone)}>
                <Phone className="h-5 w-5" aria-hidden="true" />
                Позвонить
              </a>
              {pond.websiteUrl ? (
                <a
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "w-full"
                  })}
                  href={pond.websiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Страница водоёма
                  <ExternalLink className="h-5 w-5" aria-hidden="true" />
                </a>
              ) : null}
              <a
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full"
                })}
                href={pond.mapUrl}
                rel="noreferrer"
                target="_blank"
              >
                Открыть карту
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed bottom-3 left-4 right-4 z-40 md:hidden">
        <a
          className={buttonVariants({
            size: "lg",
            className: "w-full shadow-lift"
          })}
          href={toPhoneHref(pond.phone)}
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Позвонить
        </a>
      </div>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-1 font-semibold leading-6 text-pine-900">{value}</div>
    </div>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-sand-50 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
        {label}
      </div>
      <div className="mt-2 font-bold text-pine-900">{value}</div>
    </div>
  );
}
