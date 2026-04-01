'use client';

import React from 'react';
import { Mail, Phone, AtSign } from 'lucide-react';

export default function ContactHeader() {
    return (
        <section className="relative w-full py-16 bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden">
            {/* Chalkboard Texture Overlay (Simulated) */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/dark-wood.png")`, // Subtle texture
                }}
            />

            {/* Icons Row */}
            <div className="relative z-10 flex items-center justify-center gap-8 md:gap-16 mb-4">
                <div className="text-gold">
                    <Mail size={64} strokeWidth={1.2} />
                </div>
                <div className="text-gold">
                    <Phone size={64} strokeWidth={1.2} />
                </div>
                <div className="text-gold">
                    <AtSign size={64} strokeWidth={1.2} />
                </div>
            </div>

            {/* Contact Us! Text */}
            <h2 className="relative z-10 text-white text-3xl md:text-4xl font-bold mb-2">
                Contact Us!
            </h2>

            {/* Large CONTACT US (Chalk style) */}
            <div className="relative z-10">
                <h1 className="text-6xl md:text-8xl font-black text-transparent stroke-white"
                    style={{
                        WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                        fontFamily: 'sans-serif',
                        letterSpacing: '0.05em'
                    }}>
                    CONTACT US
                </h1>
            </div>
        </section>
    );
}
