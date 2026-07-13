import type { Metadata } from "next";
import { BadgeCheck, ChartNoAxesCombined, ClipboardList, Handshake, Sparkles } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { Badge } from "@/components/Badge";
import { Card } from "@/components/ui/card";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Разместите ваш платный водоём в каталоге",
  description:
    "Заявка для владельцев платных водоёмов Московской области: карточка в каталоге, зарыбления, подборки и заявки от рыбаков.",
  openGraph: {
    title: "Разместите ваш платный водоём в каталоге",
    description:
      "Покажите рыбакам актуальные цены, зарыбления, условия ловли и получайте заявки."
  },
  alternates: {
    canonical: absoluteUrl("/for-owners")
  }
};

const benefits = [
  {
    title: "Карточка водоёма",
    description: "Название, цены, рыба, услуги, правила и быстрые контакты.",
    icon: ClipboardList
  },
  {
    title: "Публикация зарыблений",
    description: "Свежие запуски рыбы попадают в подборки на главной.",
    icon: BadgeCheck
  },
  {
    title: "Заявки от рыбаков",
    description: "Форма уже подготовлена под будущий backend и CRM.",
    icon: Handshake
  },
  {
    title: "Продвижение в подборках",
    description: "SEO-страницы под форель, карпа, беседки и семейный отдых.",
    icon: ChartNoAxesCombined
  },
  {
    title: "Помощь с оформлением",
    description: "Можно быстро привести страницу к аккуратному виду.",
    icon: Sparkles
  }
];

const tariffs = [
  { name: "Базовый", price: "0 ₽", note: "стартовое размещение" },
  { name: "Расширенный", price: "2 990 ₽/мес", note: "больше деталей и подборок" },
  { name: "Продвижение", price: "5 990 ₽/мес", note: "приоритет в категориях" },
  { name: "Премиум", price: "9 990 ₽/мес", note: "максимальная видимость" }
];

export default function ForOwnersPage() {
  return (
    <>
      <section className="bg-pine-900 py-16 text-white md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <Badge className="bg-white/10 text-sand-100 ring-white/15" tone="gray">
              Для владельцев водоёмов
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              Разместите ваш платный водоём в каталоге
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Покажите рыбакам актуальные цены, зарыбления, условия ловли и
              получайте заявки.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.slice(0, 4).map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  className="rounded-2xl bg-white/9 p-5 ring-1 ring-white/10"
                  key={benefit.title}
                >
                  <Icon className="h-6 w-6 text-sand-100" aria-hidden="true" />
                  <h2 className="mt-4 font-bold">{benefit.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Что входит
            </p>
            <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
              Всё, что нужно для первого спроса
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <Card className="p-5" key={benefit.title}>
                  <Icon className="h-6 w-6 text-pine-700" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-pine-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y bg-sand-50">
        <div className="container-page">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Будущие тарифы
            </p>
            <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
              Можно стартовать бесплатно
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tariffs.map((tariff) => (
              <Card className="p-6" key={tariff.name}>
                <h3 className="text-xl font-bold text-pine-900">{tariff.name}</h3>
                <div className="mt-4 text-3xl font-bold text-pine-700">
                  {tariff.price}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{tariff.note}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Заявка
            </p>
            <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
              Добавьте водоём в каталог
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Форма пока работает без backend: показывает success-state и выводит
              подготовленные данные в консоль. Позже её можно подключить к Formspree,
              Tally, Supabase или собственной CRM.
            </p>
          </div>
          <Card className="p-6">
            <LeadForm type="owner" />
          </Card>
        </div>
      </section>
    </>
  );
}
