"use client";

import { motion } from "framer-motion";
import { Check, Heart, Sparkles, Trophy } from "lucide-react";
import Image from "next/image";

const tiers = [
  {
    name: "The Verdant Getaway",
    subtitle: "Essential Escape",
    price: "11,999",
    duration: "3 Days / 2 Nights",
    description: "For high-performing professionals seeking a mindful reset. A gentle yet powerful pause from the chaos.",
    quote: "Pause now, so you don’t have to stop later.",
    image: "/corporate/istockphoto-2254853894-612x612.jpg.jpeg",
    icon: <Heart className="w-8 h-8 text-saffron" />,
    inclusions: [
      "Rejuvenating daily Yoga sessions in the Himalayas",
      "Immersive Forest bathing and guided Birding trails",
      "Curated team bonding and icebreakers",
      "Guided breathwork at Beatles Ashram",
      "Triveni Ghat Ganga Aarti experience",
      "Sightseeing: Laxman Jhula, Ram Jhula, Temples",
      "Authentic Uttarakhand mountain flavours",
    ],
    className: "border-saffron/20",
    buttonClass: "btn-outline border-saffron text-saffron hover:bg-saffron hover:text-white",
  },
  {
    name: "The Odyssey",
    subtitle: "Elevated Journey",
    price: "24,999",
    duration: "4 Days / 3 Nights",
    description: "For deeper wellness, connection, and immersive experiences. A transformative journey to reconnect with nature.",
    quote: "Reconnect deeply, before you realign your path.",
    image: "/corporate/0-017-0541-Distance-Sign-iPhone_8381(pp_w568_h378).jpg.jpeg",
    icon: <Sparkles className="w-8 h-8 text-purple" />,
    inclusions: [
      "Daily Yoga with certified instructors",
      "Sunrise/sunset at Kunjapuri Temple",
      "Advanced meditation at Beatles Ashram",
      "Enriching Ganga Aarti experience",
      "Scenic trek to Neer Garh Waterfall",
      "Traditional Aipan art workshop",
      "Elevated culinary mountain experiences",
    ],
    highlight: true,
    className: "border-purple scale-105 z-10 shadow-purple/10",
    buttonClass: "btn-primary bg-purple hover:bg-purple-dark text-white",
  },
  {
    name: "The Epicurean Explorer",
    subtitle: "Signature Experience",
    price: "34,999",
    duration: "4 Nights / 5 Days",
    description: "For leadership evolution, deep healing, and luxury. Where nature, wisdom, and luxury converge.",
    quote: "Don’t just perform—evolve into the leader you’re meant to be.",
    image: "/corporate/kunjapuri-sunrise-hike.jpg.jpeg",
    icon: <Trophy className="w-8 h-8 text-gold" />,
    inclusions: [
      "Intensive leadership workshops",
      "Transformational sound healing journeys",
      "Exclusive riverside white sand beach camping",
      "Premium Himalayan Spa and Wellness sessions",
      "Himalayan sunrise/sunset immersion",
      "Signature Uttarakhand mountain cuisine",
      "Premium stays and personalised flow",
      "Curated sightseeing and intentional itinerary",
    ],
    className: "border-gold/20",
    buttonClass: "btn-primary bg-gold hover:bg-gold-dark text-white",
  },
];

export default function WellnessTiers() {
  const scrollToForm = () => {
    const form = document.getElementById('inquiry-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section id="wellness-tiers" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            className="text-saffron font-semibold uppercase tracking-widest text-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Wellness Tiers
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-deepBlue"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose Your <span className="text-gradient">Breakthrough</span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Each tier is meticulously crafted to deliver measurable impact while offering an escape from corporate life.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`relative flex flex-col bg-white rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-xl ${tier.className}`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-purple text-white px-6 py-2 rounded-bl-2xl text-sm font-semibold tracking-wider z-20">
                  MOST POPULAR
                </div>
              )}

              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={tier.image} 
                  alt={tier.name} 
                  fill 
                  className="object-cover transition-transform duration-700 hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <div className="flex items-center gap-2 mb-2">
                    {tier.icon}
                    <span className="text-sm font-medium tracking-widest uppercase opacity-90">{tier.subtitle}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold">{tier.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                <div className="mb-6 flex flex-col gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Starting from</span>
                    <span className="text-3xl font-bold text-deepBlue">₹{tier.price}</span>
                    <span className="text-gray-400 text-sm">/pp</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full w-fit">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{tier.duration}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed italic">
                  "{tier.description}"
                </p>
                
                <h4 className="text-deepBlue font-bold mb-4 uppercase text-sm tracking-widest flex items-center gap-2">
                  <span className="w-8 h-px bg-gray-200" /> What's Included
                </h4>
                
                <ul className="space-y-4 mb-10">
                  {tier.inclusions.map((inclusion, i) => (
                    <li key={i} className="flex items-start gap-3 group text-gray-700">
                      <Check className="w-5 h-5 text-saffron flex-shrink-0 mt-1 transition-transform group-hover:scale-125" />
                      <span className="text-base tracking-tight leading-snug">{inclusion}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-6">
                   <div className="italic font-script text-xl text-deepBlue/70 border-l-2 border-saffron/20 pl-4 py-1">
                      "{tier.quote}"
                   </div>
                   <button 
                     onClick={scrollToForm}
                     className={`w-full py-4 rounded-xl font-bold transition-all duration-300 text-lg shadow-lg ${tier.buttonClass}`}
                   >
                     Plan Now
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
