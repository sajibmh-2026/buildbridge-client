"use client";

import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils";

type AnimationType =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "scale-up";

interface AnimateInViewProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

const animationClasses: Record<AnimationType, string> = {
  "fade-up": "translate-y-8 opacity-0",
  "fade-in": "opacity-0",
  "slide-left": "-translate-x-8 opacity-0",
  "slide-right": "translate-x-8 opacity-0",
  "scale-up": "scale-95 opacity-0",
};

const visibleClasses: Record<AnimationType, string> = {
  "fade-up": "translate-y-0 opacity-100",
  "fade-in": "opacity-100",
  "slide-left": "translate-x-0 opacity-100",
  "slide-right": "translate-x-0 opacity-100",
  "scale-up": "scale-100 opacity-100",
};

export default function AnimateInView({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className,
}: AnimateInViewProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  const style = {
    transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        isInView ? visibleClasses[animation] : animationClasses[animation],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
