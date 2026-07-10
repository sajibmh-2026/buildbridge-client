import Layout from "@/components/layout/Layout";
import {
  Hero,
  FeaturedProjects,
  Statistics,
  Categories,
  HowItWorks,
  Testimonials,
  FAQ,
  CTA,
} from "@/components/home";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Statistics />
      <Categories />
      <FeaturedProjects />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </Layout>
  );
}
