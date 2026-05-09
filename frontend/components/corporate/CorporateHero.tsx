"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  "/Corporate/corporate-hero-3.jpg",
  "/Corporate/corporate-hero-1.jpg",
  "/Corporate/corporate-hero-4.jpg",
  "/Corporate/corporate-hero-6.jpg",
  "/Corporate/corporate-hero-5.jpg",
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
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-28 md:pt-36">
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
          <div className="relative inline-block mb-10 group">
            <motion.p 
              className="text-2xl md:text-5xl font-script text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Deadlines to Lifelines
            </motion.p>
            <motion.div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            />
          </div>
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
