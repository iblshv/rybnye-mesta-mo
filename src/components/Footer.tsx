import Link from "next/link";
import { Fish } from "lucide-react";

const footerLinks = [
  { href: "/", label: "О проекте" },
  { href: "/ponds", label: "Каталог" },
  { href: "/for-owners", label: "Для владельцев" },
  { href: "mailto:ivan@blshv.ru", label: "Контакты" }
];

const selectionLinks = [
  { href: "/fish/forel", label: "Форель" },
  { href: "/fish/karp", label: "Карп" },
  { href: "/fish/shchuka", label: "Щука" },
  { href: "/features/gazebos", label: "С беседками" },
  { href: "/features/houses", label: "С домиками" },
  { href: "/features/night-fishing", label: "Ночная рыбалка" }
];

export function Footer() {
  return (
    <footer className="border-t border-pine-900/10 bg-pine-900 text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Fish className="h-5 w-5" aria-hidden="true" />
            </span>
            Рыбные места Московской области
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
            Рыбные места Московской области - независимый каталог платной рыбалки в
            Подмосковье.
          </p>
        </div>
        <div className="grid gap-4 md:justify-self-end">
          <div className="flex flex-wrap gap-2 md:justify-end">
            {footerLinks.map((link) => (
              <Link
                className="rounded-xl px-3 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex max-w-xl flex-wrap gap-x-4 gap-y-2 md:justify-end">
            {selectionLinks.map((link) => (
              <Link
                className="text-xs font-semibold text-white/60 hover:text-white"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
