"use client";

import { motion } from "framer-motion";

export default function CorporateIntroSection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.span 
          className="text-gray-500 font-medium uppercase tracking-[0.4em] text-xs md:text-sm mb-6 block"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          VEDIC TRAVEL
        </motion.span>
        
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-deepBlue mb-10 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8 }}
        >
          Tailor-Made Itineraries for Every Type of Group
        </motion.h2>

        <motion.p 
          className="text-gray-600 text-lg md:text-2xl leading-relaxed max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="text-deepBlue">Vedic Travel</span> offers a <span className="font-bold text-deepBlue">rich mix of culture, nature, and heritage</span>, which means there&apos;s something for every type of group. Some of the most popular themed experiences include:
        </motion.p>
      </div>
    </section>
  );
}
