import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold text-pine-900">Страница не найдена</h1>
        <p className="mt-4 text-slate-600">
          Возможно, водоём ещё не добавлен или ссылка устарела.
        </p>
        <Link className={buttonVariants({ className: "mt-7" })} href="/ponds">
          Вернуться в каталог
        </Link>
      </div>
    </section>
  );
}
