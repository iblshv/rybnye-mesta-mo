import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "min-h-28 w-full rounded-xl border border-pine-900/10 bg-white px-3 py-3 text-sm text-pine-900 outline-none transition placeholder:text-slate-400 focus:border-pine-700 focus:ring-2 focus:ring-pine-700/15",
      className
    )}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = "Textarea";
