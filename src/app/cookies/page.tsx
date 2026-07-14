import Layout from "@/components/layout/Layout";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Cookie Policy
        </h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>
            <strong>Last updated:</strong> July 2026
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            What Are Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit our
            website. They help us provide you with a better experience.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            How We Use Cookies
          </h2>
          <p>
            We use cookies for authentication (session token), user preferences,
            and to ensure the platform functions correctly. We do not use
            third-party tracking cookies.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Managing Cookies
          </h2>
          <p>
            You can control cookies through your browser settings. Disabling
            cookies may affect the functionality of BuildBridge, particularly
            login and session management.
          </p>
        </div>
      </div>
    </Layout>
  );
}
