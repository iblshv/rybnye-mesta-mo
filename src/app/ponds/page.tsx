import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PondFilters } from "@/components/PondFilters";
import { StructuredData } from "@/components/StructuredData";
import { getPublishedPonds } from "@/data/ponds";
import { breadcrumbJsonLd, pondListJsonLd } from "@/lib/seo";
import { canonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Каталог платных водоёмов Московской области",
  description:
    "Найдите платный водоём в Подмосковье по рыбе, расстоянию от Москвы, цене, услугам и свежим зарыблениям.",
  openGraph: {
    title: "Каталог платных водоёмов Московской области",
    description:
      "Найдите платный водоём в Подмосковье по рыбе, расстоянию от Москвы, цене, услугам и свежим зарыблениям."
  },
  alternates: {
    canonical: canonicalUrl("/ponds")
  }
};

export default function PondsPage() {
  const ponds = getPublishedPonds();
  const breadcrumbs = [
    { name: "Главная", path: "/" },
    { name: "Каталог водоёмов", path: "/ponds" }
  ];

  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd(breadcrumbs),
          pondListJsonLd("Платные водоёмы Московской области", "/ponds", ponds)
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <section className="section-y pt-8">
        <div className="container-page">
          <PondFilters ponds={ponds} />
        </div>
      </section>
    </>
  );
}
