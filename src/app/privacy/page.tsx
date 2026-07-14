import Layout from "@/components/layout/Layout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>
        <div className="prose prose-gray max-w-none space-y-4 text-gray-700">
          <p>
            <strong>Last updated:</strong> July 2026
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Information We Collect
          </h2>
          <p>
            We collect information you provide directly, including your name,
            email, skills, and profile information when you register for an
            account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to provide and improve BuildBridge services,
            connect you with relevant projects and collaborators, and communicate
            with you about your account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Data Security
          </h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. Passwords are hashed using bcrypt and all communications
            are encrypted via HTTPS.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:hello@buildbridge.dev" className="text-indigo-600">
              hello@buildbridge.dev
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
