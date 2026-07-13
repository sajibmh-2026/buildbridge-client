"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import AnimateInView from "@/components/ui/AnimateInView";
import { FiArrowRight, FiUsers, FiFolder, FiZap } from "react-icons/fi";
import { SiTypescript } from "react-icons/si";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-emerald-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimateInView animation="fade-up" delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                <FiZap className="w-4 h-4" />
                <span>Developer Collaboration Platform</span>
              </div>
            </AnimateInView>

            <AnimateInView animation="fade-up" delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Build Together,{" "}
                <span className="text-indigo-600">Ship Faster</span>
              </h1>
            </AnimateInView>

            <AnimateInView animation="fade-up" delay={200}>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Discover exciting projects, find talented teammates, and bring your ideas
                to life. BuildBridge connects developers with complementary skills to
                create amazing things.
              </p>
            </AnimateInView>

            <AnimateInView animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/explore">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Projects
                    <FiArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Start Building
                  </Button>
                </Link>
              </div>
            </AnimateInView>

            {/* Quick Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    "bg-indigo-400",
                    "bg-emerald-400",
                    "bg-amber-400",
                    "bg-rose-400",
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">2,000+ Developers</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> Active Projects
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                    <FiFolder className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">500+ Projects</h3>
                  <p className="text-sm text-gray-500">Active projects looking for contributors</p>
                </div>
                <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-white animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <FiZap className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Ship Faster</h3>
                  <p className="text-sm text-indigo-100">Find the right teammates in minutes</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-emerald-600 p-6 rounded-xl shadow-lg text-white animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <FiUsers className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">Team Up</h3>
                  <p className="text-sm text-emerald-100">Collaborate with skilled developers</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <SiTypescript className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">TypeScript</p>
                      <p className="text-xs text-gray-500">Most popular skill</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
