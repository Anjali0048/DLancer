import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        gray: "border-transparent bg-gray-500 text-gray-foreground text-white shadow hover:bg-gray-400",
        blue: "border-transparent bg-blue-500 text-blue-foreground text-white shadow hover:bg-blue-400",
        yellow: "border-transparent bg-yellow-500 text-yellow-foreground text-white shadow hover:bg-yellow-400",
        purple: "border-transparent bg-purple-500 text-purple-foreground text-white shadow hover:bg-purple-400",
        green: "border-transparent bg-green-500 text-green-foreground text-white shadow hover:bg-green-400",
        red: "border-transparent bg-red-500 text-red-foreground shadow text-white hover:bg-red-400",

      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
