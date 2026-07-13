"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type LeadFormProps = {
  type: "angler" | "owner";
  pondName?: string;
};

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export function LeadForm({ type, pondName }: LeadFormProps) {
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    await submitLead({
      type,
      name: valueOf(formData, "name"),
      phone: valueOf(formData, "phone"),
      pondName: pondName ?? valueOf(formData, "pondName"),
      date: valueOf(formData, "date"),
      comment: valueOf(formData, "comment"),
      source: type === "owner" ? "for-owners" : "pond-page",
      website: valueOf(formData, "website")
    });

    setIsSubmitting(false);
    setIsSent(true);
  }

  if (isSent) {
    return (
      <div className="rounded-2xl border border-pine-700/15 bg-pine-50 p-6 text-pine-900">
        <CheckCircle2 className="h-10 w-10 text-pine-700" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-bold">Спасибо!</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Заявка подготовлена. Мы скоро свяжемся с вами.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {type === "owner" ? (
        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Название водоёма
          <Input name="pondName" placeholder="Например, Лесной берег" required />
        </label>
      ) : (
        <input name="pondName" type="hidden" value={pondName} />
      )}

      <label className="grid gap-2 text-sm font-semibold text-pine-900">
        {type === "owner" ? "Имя владельца или администратора" : "Имя"}
        <Input name="name" placeholder="Как к вам обращаться" required />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-pine-900">
        Телефон
        <Input name="phone" placeholder="+7 900 000-00-00" required type="tel" />
      </label>

      {type === "angler" ? (
        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Желаемая дата
          <Input name="date" type="date" />
        </label>
      ) : (
        <label className="grid gap-2 text-sm font-semibold text-pine-900">
          Ссылка на страницу водоёма
          <Input name="website" placeholder="https://..." type="url" />
        </label>
      )}

      <label className="grid gap-2 text-sm font-semibold text-pine-900">
        Комментарий
        <Textarea
          name="comment"
          placeholder={
            type === "owner"
              ? "Расскажите про водоём, цены и зарыбления"
              : "Напишите, сколько человек планирует приехать"
          }
        />
      </label>

      <Button disabled={isSubmitting} size="lg" type="submit">
        <Send className="h-5 w-5" aria-hidden="true" />
        {isSubmitting ? "Готовим заявку..." : "Оставить заявку"}
      </Button>
    </form>
  );
}
