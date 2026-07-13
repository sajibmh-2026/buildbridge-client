"use client";

import Link from "next/link";
import AnimateInView from "@/components/ui/AnimateInView";
import { CATEGORIES } from "@/constants";

export default function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find projects in your area of expertise. From web development to AI, there&#39;s
              something for every developer.
            </p>
          </div>
        </AnimateInView>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((category, index) => (
            <AnimateInView key={category.value} animation="scale-up" delay={index * 60}>
              <Link
                href={`/explore?category=${category.value}`}
                className="group p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md transition-all duration-300 text-center block"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                  {category.label}
                </h3>
              </Link>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
