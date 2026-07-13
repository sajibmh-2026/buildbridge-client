"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import AnimateInView from "@/components/ui/AnimateInView";
import { FAQS } from "@/constants";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We&#39;ve got answers. Here are the most common
              questions about BuildBridge.
            </p>
          </div>
        </AnimateInView>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <AnimateInView key={index} animation="fade-up" delay={index * 60}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 transition-colors">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <FiChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
