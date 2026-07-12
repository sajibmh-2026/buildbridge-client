"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { FiArrowRight } from "react-icons/fi";

export default function CTA() {
  return (
    <section className="py-20 bg-linear-to-br from-indigo-600 via-indigo-700 to-emerald-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Build Something Amazing?
        </h2>
        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join thousands of developers who are already collaborating on
          BuildBridge. Create your profile, find your team, and start building
          today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 focus:ring-white shadow-lg w-full sm:w-auto"
            >
              Get Started Free
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              variant="ghost"
              size="lg"
              className="text-white border-2 border-white/30 hover:bg-white/10 w-full sm:w-auto"
            >
              Browse Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
