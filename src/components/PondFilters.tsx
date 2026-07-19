"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Pond } from "@/data/ponds";
import { fishOptions, sortPondsRecommended } from "@/data/ponds";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { PondCard } from "./PondCard";
import { EmptyState } from "./EmptyState";

type SortValue = "recommended" | "distance" | "price" | "stocking";

type PondFiltersProps = {
  ponds: Pond[];
};

const serviceFilters = [
  { key: "gazebos", label: "есть беседки" },
  { key: "tackleRental", label: "есть аренда снастей" },
  { key: "familyFriendly", label: "подходит для семьи" },
  { key: "nightFishing", label: "работает ночью" }
] as const;

export function PondFilters({ ponds }: PondFiltersProps) {
  const [fish, setFish] = useState("any");
  const [distance, setDistance] = useState("any");
  const [price, setPrice] = useState("any");
  const [sort, setSort] = useState<SortValue>("recommended");
  const [features, setFeatures] = useState<Record<string, boolean>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterDialogRef = useRef<HTMLDivElement>(null);
  const filterCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const feature = params.get("feature");

    setFish(params.get("fish") ?? "any");
    setDistance(params.get("distance") ?? "any");
    setPrice(params.get("price") ?? "any");

    if (feature && serviceFilters.some((filter) => filter.key === feature)) {
      setFeatures({ [feature]: true });
    }
  }, []);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const triggerElement = filterTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    filterCloseRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        filterDialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [isFilterOpen]);

  const filteredPonds = useMemo(() => {
    const maxDistance = distance === "any" ? Infinity : Number(distance);
    const maxPrice = price === "any" ? Infinity : Number(price);

    const matchingPonds = ponds
      .filter((pond) => (fish === "any" ? true : pond.fish.includes(fish)))
      .filter((pond) => pond.distanceFromMkad <= maxDistance)
      .filter((pond) => pond.priceFrom <= maxPrice)
      .filter((pond) =>
        serviceFilters.every((filter) =>
          features[filter.key] ? pond.features[filter.key] : true
        )
      );

    if (sort === "recommended") {
      return sortPondsRecommended(matchingPonds);
    }

    return [...matchingPonds].sort((a, b) => {
        if (sort === "price") {
          return a.priceFrom - b.priceFrom;
        }

        if (sort === "stocking") {
          return (
            new Date(b.lastStocking?.date ?? 0).getTime() -
            new Date(a.lastStocking?.date ?? 0).getTime()
          );
        }

        return a.distanceFromMkad - b.distanceFromMkad;
      });
  }, [distance, features, fish, ponds, price, sort]);

  function resetFilters() {
    setFish("any");
    setDistance("any");
    setPrice("any");
    setSort("recommended");
    setFeatures({});
  }

  const activeFilterCount =
    Number(fish !== "any") +
    Number(distance !== "any") +
    Number(price !== "any") +
    Object.values(features).filter(Boolean).length;

  function renderFilterFields() {
    return (
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Рыба
          <Select value={fish} onChange={(event) => setFish(event.target.value)}>
            <option value="any">Любая</option>
            {fishOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Расстояние от МКАД
          <Select value={distance} onChange={(event) => setDistance(event.target.value)}>
            <option value="any">Любое</option>
            <option value="30">до 30 км</option>
            <option value="50">до 50 км</option>
            <option value="100">до 100 км</option>
          </Select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Цена
          <Select value={price} onChange={(event) => setPrice(event.target.value)}>
            <option value="any">Любая</option>
            <option value="2000">до 2 000 ₽</option>
            <option value="3000">до 3 000 ₽</option>
            <option value="5000">до 5 000 ₽</option>
          </Select>
        </label>

        <fieldset className="grid gap-1 border-x-0 border-b-0 border-t border-pine-900/10 p-0 pt-4">
          <legend className="sr-only">Услуги и особенности</legend>
          {serviceFilters.map((filter) => (
            <label
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-1 text-sm font-semibold leading-5 text-slate-700 hover:bg-pine-50"
              key={filter.key}
            >
              <input
                checked={Boolean(features[filter.key])}
                className="h-5 w-5 shrink-0 rounded border-pine-900/20 text-pine-700 focus:ring-pine-700"
                onChange={(event) =>
                  setFeatures((current) => ({
                    ...current,
                    [filter.key]: event.target.checked
                  }))
                }
                type="checkbox"
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </fieldset>

        <label className="grid gap-2 border-t border-pine-900/10 pt-4 text-sm font-semibold text-pine-900">
          Сортировка
          <Select value={sort} onChange={(event) => setSort(event.target.value as SortValue)}>
            <option value="recommended">рекомендуемые</option>
            <option value="distance">по расстоянию</option>
            <option value="price">по цене</option>
            <option value="stocking">по последнему зарыблению</option>
          </Select>
        </label>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="hidden h-fit rounded-2xl border border-pine-900/10 bg-white p-5 shadow-soft lg:sticky lg:top-24 lg:block">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-pine-900">
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            Фильтры
          </h2>
          <button
            className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-pine-900"
            onClick={resetFilters}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Сбросить
          </button>
        </div>

        {renderFilterFields()}
      </aside>

      {isFilterOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            aria-label="Закрыть фильтры"
            className="absolute inset-0 h-full w-full cursor-default bg-pine-900/45 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
            type="button"
          />
          <div
            aria-labelledby="mobile-filters-title"
            aria-modal="true"
            className="safe-bottom absolute inset-x-0 bottom-0 flex max-h-[min(88dvh,720px)] flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift"
            ref={filterDialogRef}
            role="dialog"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-pine-900/10 px-4 py-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-pine-900" id="mobile-filters-title">
                <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                Фильтры
              </h2>
              <button
                aria-label="Закрыть фильтры"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-pine-900 transition hover:bg-pine-50"
                onClick={() => setIsFilterOpen(false)}
                ref={filterCloseRef}
                type="button"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-5">
              {renderFilterFields()}
            </div>
            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-3 border-t border-pine-900/10 bg-white px-4 pb-3 pt-3">
              <Button onClick={resetFilters} variant="outline">
                Сбросить
              </Button>
              <Button onClick={() => setIsFilterOpen(false)}>
                Показать {filteredPonds.length}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Каталог
            </p>
            <h1 className="mt-2 text-3xl font-bold text-pine-900">
              Платные водоёмы Московской области
            </h1>
          </div>
          <div aria-live="polite" className="w-fit rounded-full bg-pine-50 px-4 py-2 text-sm font-bold text-pine-900">
            Показано {filteredPonds.length} из {ponds.length}
          </div>
        </div>

        <Button
          aria-expanded={isFilterOpen}
          aria-haspopup="dialog"
          className="mb-5 w-full lg:hidden"
          onClick={() => setIsFilterOpen(true)}
          ref={filterTriggerRef}
          variant="outline"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          Фильтры{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
        </Button>

        {filteredPonds.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPonds.map((pond, index) => (
              <PondCard compact key={pond.id} pond={pond} priority={index === 0} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Подходящих водоёмов не найдено"
            description="Попробуйте расширить расстояние, бюджет или убрать часть условий."
          />
        )}

      </section>
    </div>
  );
}
