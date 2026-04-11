"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CorporateHero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/corporate/00india-beatles-1-videoSixteenByNineJumbo1600.jpg.jpeg"
          alt="Rishikesh Corporate Wellness"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-saffron font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
            Vedic Travel’s
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
            Corporate Wellness <br className="hidden md:block" /> Program
          </h1>
          <p className="text-2xl md:text-4xl font-script text-gold mb-8 opacity-90">
            Deadlines to Lifelines
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
              Explore Tiers
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-deepBlue w-full sm:w-auto px-10 py-4 text-lg">
              Get Custom Quote
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
