"use client";

import Shell from "@/components/layout/Shell";
import CorporateHero from "@/components/corporate/CorporateHero";
import ProgramDetails from "@/components/corporate/ProgramDetails";
import WellnessTiers from "@/components/corporate/WellnessTiers";
import AdditionalExperiences from "@/components/corporate/AdditionalExperiences";
import CorporateInquiryForm from "@/components/corporate/CorporateInquiryForm";
import { motion } from "framer-motion";

export default function CorporateWellnessPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-20 lg:pt-24 min-h-screen">
      <CorporateHero />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ProgramDetails />
        <WellnessTiers />
        <AdditionalExperiences />
        <CorporateInquiryForm />
      </motion.div>
      </div>
    </div>
  );
}
