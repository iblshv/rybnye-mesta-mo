import * as React from "react";
import { cn } from "@/lib/utils";

export const inputClassName =
  "h-11 w-full rounded-xl border border-pine-900/10 bg-white px-3 text-sm text-pine-900 outline-none transition placeholder:text-slate-400 focus:border-pine-700 focus:ring-2 focus:ring-pine-700/15";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input className={cn(inputClassName, className)} ref={ref} {...props} />
  )
);

Input.displayName = "Input";
