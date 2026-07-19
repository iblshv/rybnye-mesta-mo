import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Filter, Fish, MapPin, WalletCards } from "lucide-react";
import { Badge } from "@/components/Badge";
import { FaqSection } from "@/components/FaqSection";
import { Hero } from "@/components/Hero";
import { OwnerCTA } from "@/components/OwnerCTA";
import { PondCard } from "@/components/PondCard";
import { StockingList } from "@/components/StockingList";
import { StructuredData } from "@/components/StructuredData";
import { YandexMap } from "@/components/YandexMap";
import { buttonVariants } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { fishOptions, getFeaturedPonds, getPublishedPonds, getRecentStockings } from "@/data/ponds";
import { canonicalUrl, withBasePath } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Рыбные места Московской области - платная рыбалка в Подмосковье",
  description:
    "Каталог платных водоёмов Московской области: цены, зарыбления, виды рыбы, условия ловли и подбор места для рыбалки.",
  openGraph: {
    title: "Рыбные места Московской области - платная рыбалка в Подмосковье",
    description:
      "Каталог платных водоёмов Московской области: цены, зарыбления, виды рыбы, условия ловли и подбор места для рыбалки."
  },
  alternates: {
    canonical: canonicalUrl()
  }
};

const directionLinks = [
  { href: "/fish/forel", label: "Форель", icon: Fish },
  { href: "/fish/karp", label: "Карп", icon: Fish },
  { href: "/fish/osetr", label: "Осётр", icon: Fish },
  { href: "/fish/shchuka", label: "Щука", icon: Fish },
  { href: "/features/gazebos", label: "Рыбалка с беседками", icon: MapPin },
  { href: "/features/tackle-rental", label: "Аренда снастей", icon: WalletCards },
  { href: "/distance/do-50-km", label: "До 50 км от Москвы", icon: MapPin }
];

export default function HomePage() {
  const featuredPonds = getFeaturedPonds();
  const recentStockings = getRecentStockings(6);
  const publishedPonds = getPublishedPonds();

  return (
    <>
      <StructuredData data={[websiteJsonLd, organizationJsonLd]} />
      <Hero />

      <section className="bg-white py-8">
        <div className="container-page rounded-2xl border border-pine-900/10 bg-sand-50 p-5 shadow-soft md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-700 text-white">
              <Filter className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
                Быстрый подбор
              </p>
              <h2 className="text-2xl font-bold text-pine-900">
                Найдите водоём за минуту
              </h2>
            </div>
          </div>
          <form action={withBasePath("/ponds")} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="grid gap-2 text-sm font-semibold text-pine-900">
              Рыба
              <Select defaultValue="any" name="fish">
                <option value="any">Любая рыба</option>
                {fishOptions.map((fish) => (
                  <option key={fish} value={fish}>
                    {fish}
                  </option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-pine-900">
              Расстояние
              <Select defaultValue="any" name="distance">
                <option value="any">Любое</option>
                <option value="30">до 30 км</option>
                <option value="50">до 50 км</option>
                <option value="100">до 100 км</option>
              </Select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-pine-900">
              Бюджет
              <Select defaultValue="any" name="price">
                <option value="any">Любой</option>
                <option value="2000">до 2 000 ₽</option>
                <option value="3000">до 3 000 ₽</option>
                <option value="5000">до 5 000 ₽</option>
              </Select>
            </label>
            <button
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "mt-auto"
              })}
              type="submit"
            >
              Показать варианты
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Карта водоёмов
            </p>
            <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
              Выберите место по направлению и расстоянию
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              На карте отмечены все водоёмы из каталога. Откройте метку, чтобы перейти
              к карточке места и посмотреть условия.
            </p>
          </div>
          <YandexMap
            center={[55.751244, 37.618423]}
            className="min-h-[420px]"
            fallbackDescription="Откройте поиск на Яндекс.Картах или добавьте API-ключ, чтобы увидеть интерактивные метки прямо на сайте."
            fallbackTitle="Карта всех водоёмов"
            fallbackUrl="https://yandex.ru/maps/?text=платная%20рыбалка%20Московская%20область"
            loadingLabel="Загружаем карту водоёмов..."
            points={publishedPonds.map((pond) => ({
              id: pond.id,
              name: pond.name,
              coordinates: pond.coordinates,
              address: pond.address,
              href: withBasePath(`/ponds/${pond.slug}`)
            }))}
            zoom={8}
          />
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
                Популярные водоёмы
              </p>
              <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
                Проверенные форматы для выходных
              </h2>
            </div>
            <Link className={buttonVariants({ variant: "outline" })} href="/ponds">
              Все водоёмы
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPonds.map((pond) => (
              <PondCard key={pond.id} pond={pond} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-sand-50">
        <div className="container-page grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <Badge tone="sand">Актуальные запуски</Badge>
            <h2 className="mt-4 text-3xl font-bold text-pine-900 sm:text-4xl">
              Свежие зарыбления
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Смотрите, куда недавно запускали рыбу, и выбирайте водоём под текущую
              активность.
            </p>
          </div>
          <StockingList ponds={recentStockings} />
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Направления
            </p>
            <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
              Популярные подборки
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {directionLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="flex items-center justify-between gap-3 rounded-2xl border border-pine-900/10 bg-white p-5 font-bold text-pine-900 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                  href={item.href}
                  key={item.href}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    {item.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-pine-700" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FaqSection />

      <OwnerCTA />
    </>
  );
}
