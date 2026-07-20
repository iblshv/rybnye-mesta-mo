import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Waves } from "lucide-react";
import { withBasePath } from "@/lib/site";
import { buttonVariants } from "./ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[calc(82vh-64px)] overflow-hidden bg-pine-900 text-white">
      <Image
        alt="Тихий платный водоём для рыбалки в Московской области"
        className="object-cover object-[65%_center] lg:object-center"
        fill
        priority
        sizes="100vw"
        src={withBasePath("/images/hero-fishing-gazebo.png")}
      />
      <div className="absolute inset-0 bg-pine-900/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-pine-900/50 via-transparent to-transparent" />

      <div className="container-page relative flex min-h-[calc(82vh-64px)] items-end py-8 sm:items-center sm:py-16">
        <div className="max-w-3xl rounded-3xl border border-white/15 bg-pine-900/45 p-6 shadow-lift backdrop-blur-md sm:p-8 lg:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur">
            <Waves className="h-4 w-4" aria-hidden="true" />
            Каталог платной рыбалки в Подмосковье
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Платная рыбалка в Московской области
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
            Найдите водоём под вашу рыбу, бюджет и расстояние от Москвы.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "bg-white text-pine-900 hover:bg-sand-100"
              })}
              href="/ponds"
            >
              Найти водоём
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "border-white/25 bg-white/10 text-white hover:bg-white/18"
              })}
              href="/for-owners"
            >
              Добавить водоём
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-white/75">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              от 24 км от МКАД
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              10 водоёмов в каталоге
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              свежие зарыбления
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
