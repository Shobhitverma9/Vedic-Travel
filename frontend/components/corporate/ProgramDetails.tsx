"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProgramDetails() {
  return (
    <section className="py-20 md:py-32 bg-cream text-deepBlue">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="section-title text-3xl md:text-5xl lg:text-5xl text-gradient">
              A Journey into Balance, Clarity, and Renewed Purpose
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
              <p>
                Step away from the ordinary and into a transformative experience designed by Vedic Travel for today’s high-performing professionals. Our Rishikesh Corporate Wellness Program is a refined journey into balance, clarity, and renewed purpose.
              </p>
              <p>
                At the heart of this experience lies a seamless blend of ancient wisdom and modern leadership philosophy. Guided yoga and meditation sessions awaken inner stillness, while immersive practices like sound healing foster creativity and deeper human connection. 
              </p>
            </div>
            
            <motion.div 
              className="p-6 md:p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-l-4 border-saffron shadow-xl italic font-script text-xl md:text-3xl text-deepBlue/80"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              "This is not a break from work—it’s a breakthrough for your people."
            </motion.div>
          </motion.div>
 
          {/* Enhanced Image Collage */}
          <motion.div 
            className="relative h-[400px] md:h-[600px] lg:h-[700px] grid grid-cols-2 grid-rows-2 gap-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/corporate/corporate-meditation-1.jpg" 
                alt="Meditation Session" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl translate-y-8 transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/corporate/corporate-activity-2.jpg" 
                alt="Team Activity" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl -translate-y-4 transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/corporate/corporate-team-2.jpg" 
                alt="Ganga Aarti" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl translate-y-4 transform hover:scale-[1.02] transition-transform duration-500">
              <Image 
                src="/corporate/corporate-nature-2.jpg" 
                alt="Rishikesh Scenery" 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Accent Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-saffron/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
