"use client";

import Shell from "@/components/layout/Shell";
import CorporateHero from "@/components/corporate/CorporateHero";
import ProgramDetails from "@/components/corporate/ProgramDetails";
import CorporateGallery from "@/components/corporate/CorporateGallery";
import WellnessTiers from "@/components/corporate/WellnessTiers";
import AdditionalExperiences from "@/components/corporate/AdditionalExperiences";
import CorporateInquiryForm from "@/components/corporate/CorporateInquiryForm";
import CorporateIntroSection from "@/components/corporate/CorporateIntroSection";
import { motion, useScroll, useSpring } from "framer-motion";

export default function CorporateWellnessPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Shell>
      <div className="min-h-screen bg-cream selection:bg-saffron/30">
        {/* Progress Bar */}
        <motion.div
           className="fixed top-0 left-0 right-0 h-1.5 bg-saffron z-[110] origin-left"
           style={{ scaleX }}
        />

        <CorporateHero />
        
        <div className="relative">
          <ProgramDetails />
          <CorporateGallery />
          <CorporateIntroSection />
          <WellnessTiers />
          <AdditionalExperiences />
          <CorporateInquiryForm />
        </div>
      </div>
    </Shell>
  );
}
