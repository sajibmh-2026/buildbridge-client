import Layout from "@/components/layout/Layout";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">📝</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 mb-8">
            Coming soon! We&apos;ll share tips, tutorials, and stories about
            developer collaboration.
          </p>
          <Link href="/explore">
            <Button>Explore Projects Instead</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
