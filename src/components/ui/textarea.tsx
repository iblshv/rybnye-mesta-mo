import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "min-h-28 min-w-0 w-full resize-y rounded-xl border border-pine-900/10 bg-white px-3 py-3 text-base leading-6 text-pine-900 outline-none transition placeholder:text-slate-500 focus:border-pine-700 focus:ring-2 focus:ring-pine-700/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
      className
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = "Textarea";
