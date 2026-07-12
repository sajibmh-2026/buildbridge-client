import Link from "next/link";
import Button from "@/components/ui/Button";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-emerald-50 px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-indigo-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you&#39;re looking for doesn&#39;t exist or has been moved.
          Let&#39;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button>
              <FiHome className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline">
              <FiSearch className="mr-2 w-4 h-4" />
              Explore Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
