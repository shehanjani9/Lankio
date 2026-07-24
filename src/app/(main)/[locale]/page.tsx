import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { ServicesSection } from '@/components/services-section';
import { AuditSection } from '@/components/audit-section';
import { TemplateHub } from '@/components/template-hub';
import { SuccessStories } from '@/components/success-stories';
import { PricingSection } from '@/components/pricing-section';
import { PlannerSection } from '@/components/planner-section';
import { ContactSection } from '@/components/contact-section';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ServicesSection />
      <AuditSection />
      <TemplateHub />
      <SuccessStories />
      <PricingSection />
      <PlannerSection />
      <ContactSection />
    </>
  );
}
