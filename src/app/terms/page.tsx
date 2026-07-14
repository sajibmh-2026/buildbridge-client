import Layout from "@/components/layout/Layout";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>
            <strong>Last updated:</strong> July 2026
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Acceptance of Terms
          </h2>
          <p>
            By accessing and using BuildBridge, you agree to be bound by these
            Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            User Responsibilities
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and for all activities that occur under your account. You
            agree to provide accurate and complete information.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Content</h2>
          <p>
            You retain ownership of any content you submit to BuildBridge. By
            posting content, you grant BuildBridge a license to display and
            distribute it within the platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Termination
          </h2>
          <p>
            We reserve the right to terminate or suspend your account at our
            discretion, with or without notice, for conduct that violates these
            Terms.
          </p>
        </div>
      </div>
    </Layout>
  );
}
