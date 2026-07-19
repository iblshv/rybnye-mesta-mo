import { HelpCircle } from "lucide-react";
import { faqItems } from "@/data/faq";

export function FaqSection() {
  return (
    <section className="section-y bg-sand-50">
      <div className="container-page">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine-700">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-bold text-pine-900 sm:text-4xl">
            Как пользоваться сайтом
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Мы помогаем сравнить платные водоёмы и быстро перейти к контактам. Саму
            рыбалку, бронирование, оплату и условия на месте предоставляет выбранный
            водоём.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((item) => (
            <details
              className="group rounded-2xl border border-pine-900/10 bg-white p-5 shadow-sm transition open:shadow-soft"
              key={item.question}
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 text-lg font-bold text-pine-900 [&::-webkit-details-marker]:hidden">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{item.question}</span>
              </summary>
              <p className="mt-4 pl-11 text-base leading-7 text-slate-600 max-sm:pl-0">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
