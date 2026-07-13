export const siteConfig = {
  name: "BuildBridge",
  title: "BuildBridge — Developer Collaboration Platform",
  description:
    "Discover projects, recruit teammates, and build amazing things together. BuildBridge connects developers with complementary skills for open-source collaboration.",
  url: "https://buildbridge.vercel.app",
  ogImage: "/og-image.png",
  author: "BuildBridge Team",
  keywords: [
    "developer collaboration",
    "project management",
    "open source",
    "team building",
    "software development",
    "find developers",
    "coding projects",
    "tech community",
  ],
};

export function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: siteConfig.author,
    },
  };
}
