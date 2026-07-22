import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { AuditSection } from '@/components/audit-section';
import { TemplateHub } from '@/components/template-hub';
import { CaseStudiesSection } from '@/components/case-studies-section';
import { PlannerSection } from '@/components/planner-section';
import { ContactSection } from '@/components/contact-section';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <AuditSection />
      <TemplateHub />
      <CaseStudiesSection />
      <PlannerSection />
      <ContactSection />
    </>
  );
}
