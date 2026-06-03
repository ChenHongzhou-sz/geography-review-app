import * as React from "react";
import { cn } from "../../utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("frosted rounded-[1.75rem] p-5 sm:p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold tracking-tight text-ink", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 text-slate-600", className)} {...props} />
  );
}
