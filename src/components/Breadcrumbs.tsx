import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/lib/seo";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className="container-page pt-5">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-2 text-sm leading-5 text-slate-600">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex min-w-0 items-center gap-1" key={item.path}>
              {index > 0 ? (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ) : null}
              {isCurrent ? (
                <span aria-current="page" className="break-words font-semibold text-slate-700">
                  {item.name}
                </span>
              ) : (
                <Link className="hover:text-pine-800" href={item.path}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
