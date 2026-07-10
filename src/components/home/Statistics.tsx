"use client";

import { STATS } from "@/constants";

export default function Statistics() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
