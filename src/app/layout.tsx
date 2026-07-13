import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Рыбные места Московской области - платная рыбалка в Подмосковье",
    template: "%s | Рыбные места Московской области"
  },
  description:
    "Каталог платных водоёмов Московской области: цены, зарыбления, виды рыбы, условия ловли и подбор места для рыбалки.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "Рыбные места Московской области",
    title: "Рыбные места Московской области - платная рыбалка в Подмосковье",
    description:
      "Каталог платных водоёмов Московской области: цены, зарыбления, виды рыбы, условия ловли и подбор места для рыбалки.",
    images: [
      {
        url: absoluteUrl("/images/hero-fishing.png"),
        width: 1200,
        height: 800,
        alt: "Платная рыбалка в Московской области"
      }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
