"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  { src: "/Corporate/corporate-ganga-1.jpg", alt: "Ganga Aarti" },
  { src: "/Corporate/corporate-retreat-2.jpg", alt: "Team Retreat" },
  { src: "/Corporate/corporate-yoga-1.jpg", alt: "Outdoor Yoga" },
  { src: "/Corporate/corporate-team-1.jpg", alt: "Team Bonding" },
  { src: "/Corporate/corporate-nature-1.jpg", alt: "Nature Meditation" },
  { src: "/Corporate/corporate-aipan-art.jpg", alt: "Apen Art" },
  { src: "/Corporate/corporate-beatles-ashram.jpg", alt: "Beatles Ashram" },
  { src: "/Corporate/corporate-waterfall.jpg", alt: "Waterfalls" },
];

export default function CorporateGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-deepBlue mb-4"
          >
            Glimpses of <span className="text-gradient">Rishikesh</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-24 h-1 bg-saffron mx-auto rounded-full"
          />
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Experience the harmony of ancient wisdom and modern corporate retreat in the world's yoga capital.
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden group shadow-lg"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={500}
                height={500}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-medium text-sm tracking-widest uppercase">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
