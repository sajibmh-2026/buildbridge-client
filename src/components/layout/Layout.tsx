"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export default function Layout({ children, showFooter = true, className }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 pt-16 ${className || ""}`}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
