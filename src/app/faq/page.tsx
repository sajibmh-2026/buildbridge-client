import type { Metadata } from "next";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { FiHelpCircle, FiChevronDown } from "react-icons/fi";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about BuildBridge — the developer collaboration platform.",
};

const faqs = [
  {
    q: "What is BuildBridge?",
    a: "BuildBridge is a developer collaboration platform where you can discover open-source projects, recruit teammates with complementary skills, and build amazing things together.",
  },
  {
    q: "How do I join a project?",
    a: "Browse projects on the Explore page, click on one you like, and hit the 'Apply to Join' button. Write a message explaining your interest and the project owner will review your application.",
  },
  {
    q: "Can I create my own project?",
    a: "Yes! After signing up, go to 'Add Project' from the navbar. Fill in the details, select required skills, and publish. Other developers can then discover and apply to your project.",
  },
  {
    q: "Is BuildBridge free to use?",
    a: "Absolutely. BuildBridge is completely free for developers. Sign up, explore projects, and start collaborating.",
  },
  {
    q: "How does the application process work?",
    a: "When you apply to a project, the owner receives your application with your message. They can accept or reject it. You'll see the status update in your Dashboard.",
  },
  {
    q: "Can I edit or withdraw my application?",
    a: "You can view all your applications in the Dashboard. If your application is still pending, you can contact the project owner directly.",
  },
  {
    q: "How do I become an admin?",
    a: "Admin roles are assigned by existing admins. If you need admin access, please contact the BuildBridge team.",
  },
  {
    q: "I found a bug. How do I report it?",
    a: "Please reach out via our Contact page or email support@buildbridge.dev with details about the issue.",
  },
];

export default function FAQPage() {
  return (
    <Layout>
      <section className="bg-linear-to-br from-indigo-600 via-indigo-700 to-emerald-600 text-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FiHelpCircle className="w-12 h-12 mx-auto mb-4 text-indigo-200" />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-indigo-100 text-lg">
            Everything you need to know about BuildBridge
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <FiChevronDown className="w-5 h-5 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </Layout>
  );
}
