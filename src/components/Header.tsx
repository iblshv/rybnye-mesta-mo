"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Fish, Menu, Plus } from "lucide-react";
import { buttonVariants } from "./ui/button";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/ponds", label: "Каталог" },
  { href: "/for-owners", label: "Для владельцев" }
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        mobileMenuTriggerRef.current?.focus();
      }
    }

    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !mobileMenuRef.current?.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-pine-900/10 bg-white/90 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-pine-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine-700 text-white">
            <Fish className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden leading-tight sm:block">
            Рыбные места
            <span className="block text-xs font-semibold text-slate-500">
              Московской области
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-pine-50 hover:text-pine-900"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          className={buttonVariants({ variant: "primary", size: "sm", className: "hidden md:inline-flex" })}
          href="/for-owners"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Добавить водоём
        </Link>

        <details
          className="group relative md:hidden"
          onToggle={(event) => setIsMenuOpen(event.currentTarget.open)}
          open={isMenuOpen}
          ref={mobileMenuRef}
        >
          <summary
            aria-expanded={isMenuOpen}
            aria-label="Открыть меню"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-pine-900/10 bg-white text-pine-900 transition hover:bg-pine-50 [&::-webkit-details-marker]:hidden"
            ref={mobileMenuTriggerRef}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 mt-3 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-pine-900/10 bg-white p-3 shadow-soft">
            {navItems.map((item) => (
              <Link
                className="flex min-h-11 items-center rounded-xl px-3 py-2 text-base font-semibold text-slate-700 hover:bg-pine-50 hover:text-pine-900"
                href={item.href}
                key={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className={buttonVariants({
                variant: "primary",
                size: "md",
                className: "mt-2 w-full"
              })}
              href="/for-owners"
              onClick={() => setIsMenuOpen(false)}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Добавить водоём
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
