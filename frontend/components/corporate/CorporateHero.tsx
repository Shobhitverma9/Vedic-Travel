"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  "/corporate/WhatsApp Image 2026-04-11 at 3.05.03 PM.jpeg",
  "/corporate/WhatsApp Image 2026-04-11 at 3.05.01 PM.jpeg",
  "/corporate/WhatsApp Image 2026-04-11 at 3.05.04 PM.jpeg",
  "/corporate/WhatsApp Image 2026-04-11 at 3.05.06 PM.jpeg",
  "/corporate/00india-beatles-1-videoSixteenByNineJumbo1600.jpg.jpeg",
];

export default function CorporateHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    const form = document.getElementById('inquiry-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[current]}
              alt={`Slide ${current}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
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
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight">
            Corporate Wellness <br className="hidden md:block" /> Program
          </h1>
          <p className="text-xl md:text-4xl font-script text-gold mb-8 opacity-90 drop-shadow-lg">
            Deadlines to Lifelines
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => {
                 const tiers = document.getElementById('wellness-tiers');
                 if(tiers) tiers.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary w-full sm:w-auto px-10 py-4 text-lg"
            >
              Explore Tiers
            </button>
            <button 
              onClick={scrollToForm}
              className="btn-outline border-white text-white hover:bg-white hover:text-deepBlue w-full sm:w-auto px-10 py-4 text-lg"
            >
              Get Custom Quote
            </button>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
         {heroImages.map((_, i) => (
           <div 
             key={i} 
             className={`h-1 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-saffron' : 'w-2 bg-white/30'}`} 
           />
         ))}
      </div>
    </section>
  );
}
