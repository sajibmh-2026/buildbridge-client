"use client";

import { ReactNode } from "react";
import { cn } from "@/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden",
        hover && "hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div
        className={cn(
          "w-full h-48 bg-gradient-to-br from-indigo-100 to-emerald-100 flex items-center justify-center",
          className
        )}
      >
        <span className="text-4xl">🚀</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-48 object-cover", className)}
      loading="lazy"
    />
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
