import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardList, Megaphone } from "lucide-react";
import { buttonVariants } from "./ui/button";

const benefits = [
  { label: "карточка в каталоге", icon: ClipboardList },
  { label: "заявки от рыбаков", icon: BadgeCheck },
  { label: "подборки и SEO", icon: Megaphone }
];

export function OwnerCTA() {
  return (
    <section className="bg-pine-900 py-16 text-white">
      <div className="container-page grid gap-8 md:grid-cols-[1.1fr_.9fr] md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sand-200">
            Для владельцев
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            У вас платный водоём?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
            Добавьте водоём в каталог и получайте заявки от рыбаков.
          </p>
          <Link
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "mt-7 bg-white text-pine-900 hover:bg-sand-100"
            })}
            href="/for-owners"
          >
            Разместить водоём
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                className="flex items-center gap-3 rounded-2xl bg-white/9 p-4 ring-1 ring-white/10"
                key={benefit.label}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-sand-100" aria-hidden="true" />
                </span>
                <span className="font-semibold">{benefit.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
