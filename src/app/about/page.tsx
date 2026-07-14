import Layout from "@/components/layout/Layout";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About BuildBridge
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            BuildBridge is a developer collaboration platform where you can
            discover open-source projects, recruit teammates with complementary
            skills, and build amazing things together.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 rounded-xl p-5">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-1">Discover</h3>
              <p className="text-sm text-gray-600">
                Find projects matching your skills and interests
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-1">Collaborate</h3>
              <p className="text-sm text-gray-600">
                Join teams and build real-world projects together
              </p>
            </div>
            <div className="bg-amber-50 rounded-xl p-5">
              <div className="text-3xl mb-2">🌟</div>
              <h3 className="font-semibold text-gray-900 mb-1">Grow</h3>
              <p className="text-sm text-gray-600">
                Learn new skills and level up your developer career
              </p>
            </div>
          </div>
          <Link href="/explore">
            <Button>Explore Projects</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
