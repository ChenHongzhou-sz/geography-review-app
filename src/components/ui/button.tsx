import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-ocean-500 px-5 py-3.5 text-white shadow-lg shadow-ocean-500/25 hover:-translate-y-0.5 hover:bg-ocean-700",
        secondary:
          "bg-white px-5 py-3.5 text-ink shadow-md shadow-slate-200/70 hover:-translate-y-0.5 hover:bg-slate-50",
        subtle:
          "bg-ocean-50 px-4 py-3 text-ocean-900 hover:bg-ocean-100",
        ghost:
          "bg-transparent px-4 py-3 text-slate-600 hover:bg-slate-100 hover:text-ink",
        success:
          "bg-mint-500 px-5 py-3.5 text-white shadow-lg shadow-mint-500/20 hover:-translate-y-0.5 hover:bg-mint-700",
        danger:
          "bg-rose-500 px-5 py-3.5 text-white shadow-lg shadow-rose-500/20 hover:-translate-y-0.5 hover:bg-rose-600"
      },
      size: {
        default: "h-12",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-[1.4rem] px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
