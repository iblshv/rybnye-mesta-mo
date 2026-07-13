"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Pond } from "@/data/ponds";
import { fishOptions } from "@/data/ponds";
import { Button } from "./ui/button";
import { Select } from "./ui/select";
import { PondCard } from "./PondCard";
import { EmptyState } from "./EmptyState";

type SortValue = "distance" | "price" | "stocking";

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
  const [sort, setSort] = useState<SortValue>("distance");
  const [features, setFeatures] = useState<Record<string, boolean>>({});

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

  const filteredPonds = useMemo(() => {
    const maxDistance = distance === "any" ? Infinity : Number(distance);
    const maxPrice = price === "any" ? Infinity : Number(price);

    return ponds
      .filter((pond) => (fish === "any" ? true : pond.fish.includes(fish)))
      .filter((pond) => pond.distanceFromMkad <= maxDistance)
      .filter((pond) => pond.priceFrom <= maxPrice)
      .filter((pond) =>
        serviceFilters.every((filter) =>
          features[filter.key] ? pond.features[filter.key] : true
        )
      )
      .sort((a, b) => {
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
    setSort("distance");
    setFeatures({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="h-fit rounded-2xl border border-pine-900/10 bg-white p-5 shadow-soft lg:sticky lg:top-24">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-pine-900">
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
            Фильтры
          </h2>
          <button
            className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-pine-900"
            onClick={resetFilters}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Сбросить
          </button>
        </div>

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
            <Select
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
            >
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

          <div className="grid gap-3 border-t border-pine-900/10 pt-4">
            {serviceFilters.map((filter) => (
              <label
                className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-slate-700"
                key={filter.key}
              >
                <input
                  checked={Boolean(features[filter.key])}
                  className="h-4 w-4 rounded border-pine-900/20 text-pine-700 focus:ring-pine-700"
                  onChange={(event) =>
                    setFeatures((current) => ({
                      ...current,
                      [filter.key]: event.target.checked
                    }))
                  }
                  type="checkbox"
                />
                {filter.label}
              </label>
            ))}
          </div>

          <label className="grid gap-2 border-t border-pine-900/10 pt-4 text-sm font-semibold text-pine-900">
            Сортировка
            <Select value={sort} onChange={(event) => setSort(event.target.value as SortValue)}>
              <option value="distance">по расстоянию</option>
              <option value="price">по цене</option>
              <option value="stocking">по последнему зарыблению</option>
            </Select>
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
              Каталог
            </p>
            <h1 className="mt-2 text-3xl font-bold text-pine-900">
              Платные водоёмы Московской области
            </h1>
          </div>
          <div className="rounded-full bg-pine-50 px-4 py-2 text-sm font-bold text-pine-900">
            Показано {filteredPonds.length} из {ponds.length}
          </div>
        </div>

        {filteredPonds.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPonds.map((pond) => (
              <PondCard compact key={pond.id} pond={pond} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Подходящих водоёмов не найдено"
            description="Попробуйте расширить расстояние, бюджет или убрать часть условий."
          />
        )}

        <Button className="mt-6 w-full sm:hidden" onClick={resetFilters} variant="outline">
          Сбросить фильтры
        </Button>
      </section>
    </div>
  );
}
