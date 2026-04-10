'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        id: 1,
        name: 'Rajesh Mehta',
        location: 'Mumbai',
        role: 'Business Owner',
        rating: 5,
        text: 'My Chardham Yatra with Vedic Travel was nothing short of divine. Everything was so well-organized—from helicopter transfers to VIP darshan—that I could truly focus on my spiritual journey without any stress. Their team ensured comfort even in high-altitude conditions. Highly recommended for anyone seeking a premium pilgrimage experience.',
        image: '/8.png',
    },
    {
        id: 2,
        name: 'Dr. Ananya Sharma',
        location: 'Delhi',
        role: 'Cardiologist',
        rating: 5,
        text: 'I booked the Golden Triangle with Varanasi, Prayagraj, and Ayodhya tour, and it was beautifully curated. The blend of heritage and spirituality was perfect. Witnessing Ganga Aarti in Varanasi and visiting Ram Janmabhoomi in Ayodhya felt deeply fulfilling. Vedic Travel’s attention to detail is exceptional.',
        image: '/11.png',
    },
    {
        id: 3,
        name: 'Vikram Singh',
        location: 'Bengaluru',
        role: 'Senior IT Consultant',
        rating: 5,
        text: 'Traveling to Bali with Vedic Travel was a refreshing escape from my hectic corporate life. The itinerary perfectly balanced relaxation, culture, and nature. From serene temples to scenic landscapes, everything was thoughtfully planned. It truly felt like a rejuvenating retreat.',
        image: '/10.png',
    },
    {
        id: 4,
        name: 'Sunita Verma',
        location: 'Jaipur',
        role: 'Homemaker',
        rating: 5,
        text: 'Our Rameshwaram trip was incredibly smooth and spiritually enriching. Vedic Travel took care of everything, including temple rituals and local guidance. It gave us peace of mind and allowed us to fully immerse in devotion. A heartfelt thank you to the entire team.',
        image: '/12.png',
    },
    {
        id: 5,
        name: 'Amitabh Gupta',
        location: 'Kolkata',
        role: 'Chartered Accountant',
        rating: 5,
        text: 'Chardham Yatra had always been a dream, and Vedic Travel made it come true in the most comfortable way possible. The accommodations, food, and assistance at every step were top-notch. Their professionalism and dedication truly stand out.',
        image: '/7.png',
    },
    {
        id: 6,
        name: 'Neha Kapoor',
        location: 'Chandigarh',
        role: 'Entrepreneur',
        rating: 5,
        text: 'I explored Varanasi, Prayagraj, and Ayodhya with Vedic Travel, and it was an unforgettable experience. The guides were knowledgeable, and the arrangements were seamless. The spiritual energy of these places, combined with their premium service, made it truly special.',
        image: '/13.png',
    },
    {
        id: 7,
        name: 'Rohan Desai',
        location: 'Pune',
        role: 'Marketing Head',
        rating: 5,
        text: 'Our Bali trip with Vedic Travel was beyond expectations. Every detail—from luxury stays to temple visits—was perfectly handled. It felt like a personalized experience crafted just for us. I came back refreshed, both mentally and spiritually.',
        image: '/9.png',
    },
];

const MandalaSVG = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
        {[...Array(12)].map((_, i) => (
            <motion.path
                key={i}
                d="M100 30C110 30 120 40 120 55C120 70 110 80 100 80C90 80 80 70 80 55C80 40 90 30 100 30Z"
                stroke="currentColor"
                strokeWidth="1"
                style={{ transformOrigin: '100px 100px', rotate: `${i * 30}deg` }}
            />
        ))}
        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
    <div className="w-[300px] md:w-[380px] flex-shrink-0 bg-white p-6 rounded-xl border border-white/10 mx-3 flex flex-col h-full relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="w-12 h-12 text-saffron" />
        </div>

        <div className="flex items-center gap-4 mb-4 z-10">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-saffron/20">
                <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
                <h3 className="font-bold text-base text-deepBlue">{testimonial.name}</h3>
                <p className="text-[10px] text-saffron font-medium uppercase tracking-wider">{testimonial.role}</p>
                <div className="flex items-center text-gray-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                </div>
            </div>
        </div>

        <div className="flex mb-4 text-saffron/80">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'fill-current' : 'text-gray-100'}`} />
            ))}
        </div>

        <p className="text-gray-600 italic leading-relaxed text-sm md:text-base z-10 relative">
            "{testimonial.text}"
        </p>
    </div>
);

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#004d4d] via-[#006666] to-[#004d4d]">
            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                <MandalaSVG className="absolute -top-10 -right-10 w-64 h-64 text-saffron/10 opacity-30" />
            </div>

            {/* Top Wave - cream color on sea green background */}
            <div className="w-full overflow-hidden leading-none" style={{ fontSize: 0, marginBottom: '-2px' }}>
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#FFF8F3" d="M0,40L48,42C96,44,192,48,288,46C384,44,480,36,576,33C672,30,768,32,864,35C960,38,1056,42,1152,42C1248,41,1344,36,1392,34L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
                </svg>
            </div>

            <div className="container mx-auto px-4 pb-12 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-1">Guest Experiences & Reflections</h2>
                    <p className="text-sm text-cyan-100">“Moments of devotion, comfort, and discovery—shared by our esteemed guests.”</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-end">
                    {/* Left Side: Single Marquee Carousel */}
                    <div className="w-full overflow-hidden flex flex-col justify-end relative">
                        {/* Slim edge fades */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#005555] to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#005555] to-transparent z-10 pointer-events-none"></div>

                        {/* Single Row - Left to Right */}
                        <div className="flex overflow-hidden py-0 relative z-0">
                            <motion.div
                                className="flex"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 35,
                                }}
                            >
                                {[...testimonials, ...testimonials].map((t, index) => (
                                    <TestimonialCard key={`testimonial-${t.id}-${index}`} testimonial={t} />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Video Testimonial - Commented out for now
                    <div className="w-full lg:w-1/3 relative h-[360px] md:h-[440px] flex items-center mt-4 lg:mt-0">
                        <div className="w-full h-[90%] lg:h-full rounded-2xl overflow-hidden shadow-xl border border-cyan-800/50 group/video relative">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster="https://images.unsplash.com/photo-1605646964177-d64843939633?w=800&q=80"
                            >
                                <source src="https://assets.mixkit.co/videos/preview/mixkit-morning-fog-over-the-mountains-2591-large.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Watch Story</span>
                                </div>
                                <h3 className="text-xl font-bold leading-tight">Finding Peace in Kedarnath</h3>
                                <p className="text-gray-200 mt-1 text-xs">Suresh Prabhu's Experience</p>
                            </div>

                            <button className="absolute inset-0 flex items-center justify-center z-20 group/play">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover/play:scale-110 transition-all duration-300">
                                    <div className="w-12 h-12 bg-saffron rounded-full flex items-center justify-center shadow-lg">
                                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                    */}
                </div>
            </div>

            {/* Bottom Wave - warm cream/orange-50 color on sea green background */}
            <div className="w-full overflow-hidden leading-none" style={{ fontSize: 0, marginTop: '-2px' }}>
                <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[60px]" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#fff7ed" d="M0,40C150,80,350,0,500,40C650,80,850,0,1000,40C1150,80,1350,0,1440,40L1440,80L0,80Z" />
                </svg>
            </div>
        </section>
    );
}
