import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PondCard } from "@/components/PondCard";
import { StructuredData } from "@/components/StructuredData";
import { buttonVariants } from "@/components/ui/button";
import { distanceSeoPages, getDistanceSeoPage } from "@/data/seo-pages";
import { getPublishedPonds, sortPondsRecommended } from "@/data/ponds";
import { breadcrumbJsonLd, pondListJsonLd } from "@/lib/seo";
import { canonicalUrl } from "@/lib/site";

type DistancePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return distanceSeoPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: DistancePageProps): Metadata {
  const page = getDistanceSeoPage(params.slug);

  if (!page) {
    return { title: "Подборка не найдена" };
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description },
    alternates: { canonical: canonicalUrl(`/distance/${page.slug}`) }
  };
}

export default function DistanceSeoPage({ params }: DistancePageProps) {
  const page = getDistanceSeoPage(params.slug);

  if (!page) {
    notFound();
  }

  const matchingPonds = sortPondsRecommended(
    getPublishedPonds().filter((pond) => pond.distanceFromMkad <= page.maxDistance)
  );
  const breadcrumbs = [
    { name: "Главная", path: "/" },
    { name: "Каталог водоёмов", path: "/ponds" },
    { name: `До ${page.maxDistance} км от МКАД`, path: `/distance/${page.slug}` }
  ];

  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd(breadcrumbs),
          pondListJsonLd(page.title, `/distance/${page.slug}`, matchingPonds)
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <section className="section-y pt-8">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Подборка по расстоянию
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-pine-900 sm:text-5xl">
              {page.title}
            </h1>
            <div className="mt-6 grid gap-4 text-left text-base leading-7 text-slate-600">
              {page.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className={buttonVariants({ className: "mt-8" })} href="/ponds">
              Открыть каталог с фильтрами
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matchingPonds.map((pond) => (
              <PondCard compact key={pond.id} pond={pond} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
