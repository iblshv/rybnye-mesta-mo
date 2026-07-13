"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

type Coordinates = [number, number];

type MapPoint = {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
  href?: string;
};

type YandexMapProps = {
  points: MapPoint[];
  center: Coordinates;
  zoom?: number;
  className?: string;
  fallbackUrl?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  loadingLabel?: string;
};

type YandexMapInstance = {
  geoObjects: {
    add: (object: unknown) => void;
  };
  controls: {
    remove: (name: string) => void;
  };
  destroy: () => void;
};

type YandexMapsApi = {
  ready: (callback: () => void) => void;
  Map: new (
    container: HTMLElement,
    state: { center: Coordinates; zoom: number; controls?: string[] },
    options?: Record<string, unknown>
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: Coordinates,
    properties: Record<string, string | undefined>,
    options?: Record<string, unknown>
  ) => unknown;
};

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
    yandexMapsPromise?: Promise<YandexMapsApi>;
  }
}

const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

function loadYandexMaps() {
  if (!apiKey) {
    return Promise.reject(new Error("Yandex Maps API key is not configured"));
  }

  if (window.ymaps) {
    return Promise.resolve(window.ymaps);
  }

  if (!window.yandexMapsPromise) {
    window.yandexMapsPromise = new Promise<YandexMapsApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(
        apiKey
      )}&lang=ru_RU`;
      script.onload = () => {
        if (!window.ymaps) {
          reject(new Error("Yandex Maps API was not loaded"));
          return;
        }

        window.ymaps.ready(() => resolve(window.ymaps as YandexMapsApi));
      };
      script.onerror = () => reject(new Error("Failed to load Yandex Maps API"));
      document.head.appendChild(script);
    });
  }

  return window.yandexMapsPromise;
}

export function YandexMap({
  points,
  center,
  zoom = 10,
  className,
  fallbackUrl,
  fallbackTitle = "Карта водоёма",
  fallbackDescription = "Откройте точку на Яндекс.Картах, чтобы уточнить маршрут и подъезд.",
  loadingLabel = "Загружаем карту..."
}: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<YandexMapInstance | null>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "fallback">(
    apiKey ? "idle" : "fallback"
  );

  useEffect(() => {
    if (!apiKey || !containerRef.current || points.length === 0) {
      return;
    }

    let isMounted = true;

    loadYandexMaps()
      .then((ymaps) => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        mapRef.current?.destroy();

        const map = new ymaps.Map(
          containerRef.current,
          {
            center,
            zoom,
            controls: ["zoomControl", "fullscreenControl"]
          },
          {
            suppressMapOpenBlock: true
          }
        );

        map.controls.remove("geolocationControl");
        map.controls.remove("searchControl");
        map.controls.remove("trafficControl");
        map.controls.remove("typeSelector");

        points.forEach((point) => {
          const placemark = new ymaps.Placemark(
            point.coordinates,
            {
              balloonContentHeader: point.name,
              balloonContentBody: point.address,
              balloonContentFooter: point.href
                ? `<a href="${point.href}" target="_blank" rel="noreferrer">Открыть страницу</a>`
                : undefined,
              hintContent: point.name
            },
            {
              preset: "islands#darkGreenDotIcon"
            }
          );

          map.geoObjects.add(placemark);
        });

        mapRef.current = map;
        setStatus("ready");
      })
      .catch(() => {
        if (isMounted) {
          setStatus("fallback");
        }
      });

    return () => {
      isMounted = false;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [center, points, zoom]);

  if (status === "fallback") {
    return (
      <div
        className={cn(
          "flex min-h-72 flex-col justify-between rounded-2xl border border-pine-900/10 bg-pine-50 p-6",
          className
        )}
      >
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-pine-700">
            <MapPinned className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-pine-900">{fallbackTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{fallbackDescription}</p>
        </div>
        {fallbackUrl ? (
          <a
            className={buttonVariants({ variant: "outline", className: "mt-5 w-full" })}
            href={fallbackUrl}
            rel="noreferrer"
            target="_blank"
          >
            Открыть в Яндекс.Картах
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-72 overflow-hidden rounded-2xl border border-pine-900/10 bg-pine-50",
        className
      )}
    >
      {status === "idle" ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-pine-900">
          {loadingLabel}
        </div>
      ) : null}
      <div className="h-full min-h-72 w-full" ref={containerRef} />
    </div>
  );
}
