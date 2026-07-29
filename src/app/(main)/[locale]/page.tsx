import { Hero } from '@/components/hero';
import { ServicesSection } from '@/components/services-section';
import { AuditBanner } from '@/components/audit-banner';
import { PortfolioSection } from '@/components/portfolio-section';
import { SuccessStories } from '@/components/success-stories';
import { PricingSection } from '@/components/pricing-section';
import { PlannerSection } from '@/components/planner-section';
import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <AuditBanner />
      <PortfolioSection />
      <SuccessStories />
      <PricingSection />
      <PlannerSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}