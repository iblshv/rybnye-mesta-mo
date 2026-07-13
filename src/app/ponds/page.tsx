import type { Metadata } from "next";
import { PondFilters } from "@/components/PondFilters";
import { ponds } from "@/data/ponds";
import { absoluteUrl } from "@/lib/site";

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
    canonical: absoluteUrl("/ponds")
  }
};

export default function PondsPage() {
  return (
    <section className="section-y">
      <div className="container-page">
        <PondFilters ponds={ponds} />
      </div>
    </section>
  );
}
