import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  "w-full mx-auto",
  {
    variants: {
      size: {
        sm: "max-w-3xl",
        default: "max-w-6xl",
        lg: "max-w-7xl",
        xl: "max-w-screen-2xl",
        full: "max-w-none"
      },
      padding: {
        none: "",
        sm: "px-4 sm:px-6",
        default: "container-padding",
        lg: "px-6 sm:px-8 lg:px-12"
      }
    },
    defaultVariants: {
      size: "default",
      padding: "default"
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, padding, className }))}
      {...props}
    />
  )
);
Container.displayName = "Container";

// Section wrapper with consistent padding
const sectionVariants = cva(
  "w-full",
  {
    variants: {
      padding: {
        none: "",
        sm: "py-8",
        default: "section-padding",
        lg: "py-24 lg:py-32"
      },
      background: {
        none: "",
        muted: "bg-muted/50",
        card: "bg-card",
        gradient: "bg-gradient-secondary"
      }
    },
    defaultVariants: {
      padding: "default",
      background: "none"
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ padding, background, className }))}
      {...props}
    />
  )
);
Section.displayName = "Section";

export { Container, Section };