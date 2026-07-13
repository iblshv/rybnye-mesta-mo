import * as React from "react";
import { cn } from "@/lib/utils";
import { inputClassName } from "./input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select className={cn(inputClassName, "cursor-pointer", className)} ref={ref} {...props}>
      {children}
    </select>
  )
);

Select.displayName = "Select";
