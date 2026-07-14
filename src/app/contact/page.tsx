import Layout from "@/components/layout/Layout";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-6">📬</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 mb-8">
            Have questions, feedback, or want to collaborate? We&apos;d love to
            hear from you.
          </p>
          <div className="space-y-4 text-left">
            <a
              href="mailto:hello@buildbridge.dev"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <FiMail className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700">hello@buildbridge.dev</span>
            </a>
            <a
              href="https://github.com/sajibmh-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <FiGithub className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700">GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <FiLinkedin className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
