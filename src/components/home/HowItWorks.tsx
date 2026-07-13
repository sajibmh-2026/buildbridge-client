"use client";

import AnimateInView from "@/components/ui/AnimateInView";
import { HOW_IT_WORKS } from "@/constants";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How BuildBridge Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and join a community of developers
              building amazing projects together.
            </p>
          </div>
        </AnimateInView>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-indigo-200" />

          {HOW_IT_WORKS.map((step, index) => (
            <AnimateInView key={index} animation="fade-up" delay={index * 150}>
              <div className="relative text-center group">
                <div className="relative z-10 w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:border-indigo-300 group-hover:shadow-indigo-100 transition-all duration-300">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold z-20">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 max-w-xs mx-auto leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
