"use client";

import { motion } from "framer-motion";
import { Waves, Zap, Leaf } from "lucide-react";

const extraExperiences = [
  {
    title: "White-water River Rafting",
    description: "Challenge your team on the sacred Ganges—building trust and synchronization through every rapid.",
    icon: <Waves className="w-12 h-12 text-blue-500" />,
    tag: "Team Synergy",
  },
  {
    title: "Bungee Jumping",
    description: "Experience the ultimate breakthrough—confronting fears and celebrating courage as a collective.",
    icon: <Zap className="w-12 h-12 text-orange-500" />,
    tag: "Personal Growth",
  },
  {
    title: "Jungle Safari",
    description: "Immersion in the Rajaji Tiger Reserve—reconnecting with nature and discovering pure wilderness.",
    icon: <Leaf className="w-12 h-12 text-green-500" />,
    tag: "Nature Immersion",
  },
];

export default function AdditionalExperiences() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-saffron font-semibold uppercase tracking-widest text-sm">
              Tailored For You
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-deepBlue">
              Additional Experiences <br />
              <span className="text-gradient">On Request</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              For teams seeking an extra edge of thrill and exploration, we offer curated add-ons that push boundaries and create unforgettable memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            {extraExperiences.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-saffron/20 transition-all duration-300"
              >
                <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-saffron/5 transition-colors">
                  {item.icon}
                </div>
                <div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-saffron bg-saffron/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                     {item.tag}
                   </span>
                   <h3 className="text-xl font-bold text-deepBlue mb-1 group-hover:text-saffron transition-colors">
                     {item.title}
                   </h3>
                   <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                     {item.description}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
