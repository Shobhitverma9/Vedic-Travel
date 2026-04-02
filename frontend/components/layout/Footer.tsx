"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronRight, CreditCard, Landmark, Wallet, Globe, ShieldCheck, Lock } from 'lucide-react';

const paymentLogos = [
    {
        name: "Visa",
        svg: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-auto">
                <path d="M18.89 31.95L15.34 11.23C15.19 10.42 14.31 9.68 13.56 9.68H2L1.87 10.3C1.87 10.3 5.43 11.4 8.28 13.14C10.15 14.28 10.74 15.08 11.16 16.59L14.77 31.95H18.89Z" fill="#1A1F71"/>
                <path d="M33.63 10.02C31.54 10.02 29.83 11.23 29.83 13.51C29.83 17.51 35.34 17.73 35.34 20.35C35.34 21.54 34.12 22.51 32.33 22.51C30.01 22.51 27.81 21.43 26.8 20.91L26.15 21.42L26.15 24.31C27.12 24.78 29.35 25.5 31.75 25.5C36.43 25.5 39.53 23.11 39.53 19.43C39.53 13.78 31.81 13.43 31.81 11.08C31.81 10.22 32.74 9.17 34.65 9.17C36.46 9.17 38.08 9.94 39.02 10.48L39.69 9.96L39.69 7.02C38.68 6.55 36.63 5.8 34.25 5.8" transform="translate(0 3.88)" fill="#1A1F71"/>
                <path d="M28.05 10H24.39L18.42 24.49L17.72 21.09L16.27 13.42C16.12 12.61 15.24 11.87 14.49 11.87H10L27.1 27.28L28.05 10Z" transform="translate(0 3.88)" fill="#1A1F71" className="hidden"/>
                <path d="M28.84 9.92H24.87L18.57 25.04L22.61 25.04L23.41 23.05H28.37L28.84 25.04H32.76L28.84 9.92ZM24.58 20.19L26.6 15.17L27.76 20.19H24.58Z" transform="translate(0 3.88)" fill="#1A1F71"/>
                <path d="M12.98 9.92L8.94 25.04H4.95L8.99 9.92H12.98Z" transform="translate(0 3.88)" fill="#F79E1B"/>
            </svg>
        )
    },
    {
        name: "Mastercard",
        svg: (
            <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-auto">
                <circle cx="9" cy="12" r="9" fill="#EB001B"/>
                <circle cx="23" cy="12" r="9" fill="#F79E1B"/>
                <path d="M16 4.3C14.7 6.4 14 8.9 14 11.5C14 14.1 14.7 16.6 16 18.7C17.3 16.6 18 14.1 18 11.5C18 8.9 17.3 6.4 16 4.3Z" fill="#FF5F00"/>
            </svg>
        )
    },
    {
        name: "UPI",
        svg: (
            <svg viewBox="0 0 45 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-auto">
                <path d="M4.6 2.5h1.5v6.2c0 2-1.3 3.3-3 3.3s-3-1.3-3-3.3V2.5h1.5v6.2c0 1 .7 1.8 1.5 1.8s1.5-.8 1.5-1.8V2.5zM11.5 2.5c2 0 3.3 1.3 3.3 3.3s-1.3 3.3-3.3 3.3h-1.5v2.9H8.5V2.5h3zm-1.5 5.1h1.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H10v3.6zM15.5 2.5h1.5V12h-1.5V2.5z" fill="#097939"/>
                <path d="M30 2.5l-2.5 5-2.5-5h-1.6l3.3 6.5V12h1.5V9l3.3-6.5H30zM36.5 2.5c2 0 3.3 1.3 3.3 3.3s-1.3 3.3-3.3 3.3h-1.5v2.9H33.5V2.5h3zm-1.5 5.1h1.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H35v3.6zM40.5 2.5h1.5V12h-1.5V2.5z" fill="#0071BB"/>
            </svg>
        )
    },
    {
        name: "RuPay",
        svg: (
            <svg viewBox="0 0 500 135" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-auto grayscale transition-all duration-300">
                <path d="M129.5 24.3l-24.8 86.4h-28.7l24.8-86.4h28.7z" fill="#251F5F"/>
                <path d="M166.7 110.7c-1.3 0-2.6 0-3.9-.1-11.2-.5-21-4.7-29.2-12.7-8.1-7.9-12.2-17.7-12.1-29.3 0-8.8 3.1-17.2 8.7-23.7.1-.1.2-.3.3-.4 10.9-12.8 25.5-19.3 43.6-19.3.9 0 1.8 0 2.7.1 23 1.2 41 19.3 42.1 42.4.5 11-3.6 20.8-12.3 29.3-9.5 9.4-21.7 13.9-38.6 13.9-1.3 0-1.3-.1-1.3-.2 0-.2 1.3-.1 1.3-.1 13.8 0 23.3-3.9 30.2-11.2 7.1-7.5 10.6-16.7 10.2-27.4-.9-18.7-16-33.8-34.7-34.7-.9-.1-1.8-.1-2.7-.1-14.7 0-26.6 5.5-35.4 16.3 0 .1-.1.2-.2.3-4.5 5.7-7.1 12.3-7.2 19.8 0 8.8 3.3 16.7 9.8 23.5 6.6 6.9 14.6 10.2 24.5 10.2 1.3 0 2.6-.1 3.9-.2l-3.9 13.6z" fill="#DC4437"/>
                <path d="M433.8 24.3l-45.6 55.4-8.8-55.4h-28.7l12.3 75.1-4.6 15.6c-4.4 14.8-13.6 22.1-27.5 22.1-3.2 0-6.1-.5-8.7-1.4l-3.6 12.1c4.5 1.7 9.3 2.6 14.2 2.6 21 0 35.8-12 43.8-35.7l27.1-90.4h28.7z" fill="#DC4437"/>
                <path d="M228.4 24.3h-28.7l-9.1 31.7c4.6-2.2 9.6-3.4 15.1-3.4 19.1 0 31.4 12.5 31.4 31.8 0 16.4-9.3 26.4-24.3 26.4h-8.8l-5.7 19.8h8.8c30 0 52.6-17.6 52.6-47.5 0-33.8-22.1-58.8-52.6-58.8M218.4 93.3c7.5 0 11.2-4.1 11.2-11 0-7.3-5.2-12.8-13.6-12.8-.7 0-1.4.1-2 .2l-6.8 23.6h11.2z" fill="#251F5F"/>
                <path d="M351.4 24.3h-28.7l-24.8 86.4h28.7l5.2-18.1h15.5l.6-2.1c8.1-1.3 13.5-2.2 16.9-3l12.4 23.2h32.7l-15.6-29.2c16.3-4.5 28.5-16.1 28.5-35.8 0-3.3-.5-6.7-1.5-10.3l-4.2-14.7h.1c-9.1-11.4-23.7-16.4-44.5-16.4h-21.3zm3.7 51l-4.5 15.6h-7.8l5.2-18.1h3.3c3.7.1 3.8.4 3.8 2.5zm11.7-40.8l4 13.9c.7 2.6 1.1 5.2 1.1 7.4 0 7.3-3.6 12.8-10.2 12.8h-11.1l8.1-28.3h8.3c-.2-4 .1-5.8-.2-5.8" fill="#251F5F"/>
            </svg>
        )
    },
    {
        name: "Amex",
        svg: (
             <svg viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-auto">
                <rect width="32" height="24" rx="2" fill="#007BC1"/>
                <path d="M5.5 15.5h2L8.5 13h3l1 2.5h2L11 7.5H8.5L5.5 15.5zM9.3 11l.7-2 .7 2h-1.4zM16 7.5h2l2 4 2-4h2v8h-1.5V10l-2 4h-1l-2-4v5.5H16v-8zm11 0h4v1.5h-2.5v2h2v1.5h-2v2H31v1.5h-4v-8z" fill="#FFF"/>
            </svg>
        )
    }
];

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const footerSections = [
        {
            title: "Quick Links",
            links: [
                { name: "Home", href: "/" },
                { name: "About us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Careers", href: "/careers" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
                { name: "Cancellation Policy", href: "/cancellation-policy" },
                { name: "Privacy Policy", href: "/privacy-policy" }
            ]
        },
        {
            title: "Tour Resources",
            links: [
                { name: "Videos", href: "/videos" },
                { name: "Gallery", href: "/gallery" },
                { name: "Traveller Reviews", href: "/reviews" },
                { name: "News", href: "/news" },
                { name: "Kailash Yatra FAQs", href: "/kailash-faqs" },
                { name: "Download All Important Doc", href: "/downloads" },
                { name: "Bank Details", href: "/bank-details" }
            ]
        },
        {
            title: "Temple Packages",
            links: [
                { name: "Mt. Kailash Aerial Darshan", href: "/packages/kailash-aerial" },
                { name: "Kailash Yatra from India by Heli", href: "/packages/kailash-heli-india" },
                { name: "Kailash Yatra by Road", href: "/packages/kailash-road" },
                { name: "Kailash by Heli (5 D)", href: "/packages/kailash-heli-5d" },
                { name: "Kailash by Heli Ex Kathmandu", href: "/packages/kailash-heli-kathmandu" },
                { name: "Kailash Yatra Ex Lucknow (9 D)", href: "/packages/kailash-lucknow" },
                { name: "Kailash Mansarovar Inner Kora", href: "/packages/kailash-inner-kora" }
            ]
        },
        {
            title: "Popular Destinations",
            links: [
                { name: "Kailash Yatra Packages", href: "/destinations/kailash" },
                { name: "Char Dham Yatra", href: "/destinations/chardham" },
                { name: "Adi Kailash Yatra", href: "/destinations/adi-kailash" },
                { name: "Sri Lanka Tour Package", href: "/destinations/sri-lanka" },
                { name: "Varanasi Tour Packages", href: "/destinations/varanasi" },
                { name: "Nepal Tour Packages", href: "/destinations/nepal" },
                { name: "Bhutan Tour Packages", href: "/destinations/bhutan" }
            ]
        },
        {
            title: "Knowledge Hub",
            links: [
                { name: "About Mount Kailash", href: "/blog/about-kailash" },
                { name: "History Of Kailash Mansarovar", href: "/blog/history-kailash" },
                { name: "Adi Kailash", href: "/blog/adi-kailash" },
                { name: "Shiva The God Of Gods", href: "/blog/shiva" },
                { name: "Adi Kailash Tour Blogs", href: "/blog/adi-kailash-blogs" },
                { name: "Chota Chardham Yatra", href: "/blog/chota-chardham" },
                { name: "Customize Your Kailash Mansarovar", href: "/blog/customize-kailash" }
            ]
        }
    ];

    return (
        <footer className="relative bg-[#0d1522] text-white pt-12 overflow-hidden border-t-2 border-saffron">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-deepBlue/50 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Main Link Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
                    {footerSections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gold border-b border-white/10 pb-2 relative inline-block">
                                {section.title}
                                <div className="absolute bottom-0 left-0 w-8 h-px bg-saffron"></div>
                            </h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-all duration-300 text-[13px] font-medium flex items-center group"
                                        >
                                            <ChevronRight size={14} className="text-saffron opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-1" />
                                            <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Compact Payment Section */}
                <div className="mb-6 border-t border-white/10 pt-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-6 py-6 bg-white/[0.03] border border-white/5 rounded-3xl backdrop-blur-md">
                        {/* Security Trust Badge */}
                        <div className="flex items-center gap-4 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-saffron/10 border border-saffron/20 text-saffron group-hover:bg-saffron group-hover:text-white transition-all duration-300">
                                <ShieldCheck size={26} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white tracking-wide uppercase">100% Secure Payments</h4>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                                    <Lock size={10} className="text-green-500" />
                                    <span>PCI-DSS SSL Certified</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Partner Logos */}
                        <div className="flex flex-wrap justify-center items-center gap-5 md:gap-10">
                            {paymentLogos.map((logo, idx) => (
                                <div 
                                    key={idx} 
                                    className="filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-help transform hover:scale-110 active:scale-95"
                                    title={logo.name}
                                >
                                    {logo.svg}
                                </div>
                            ))}
                        </div>

                        {/* Alternative Options Text */}
                        <div className="hidden xl:flex items-center gap-4 text-gray-500">
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-[11px] font-medium leading-tight">
                                <p>Net Banking</p>
                                <p>EMI & Wallets</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branded Bottom Footer */}
            <div className="bg-[#080d15] py-5 border-t border-white/5">
                <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="text-xs text-gray-500 font-medium tracking-wide">
                        &copy; {currentYear} <span className="font-bold text-white">Vedic Travel</span>. Rediscovering Ancient Bharat.
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium">
                        A Unit of Travergetic Innovations Pvt Ltd
                    </div>
                </div>
            </div>

            {/* Back to Top */}
            <div className="fixed bottom-24 right-6 z-50">
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="bg-saffron text-white p-3 rounded-full shadow-[0_4px_14px_0_rgba(255,87,34,0.39)] hover:bg-[#e64a19] hover:-translate-y-1 transition-all duration-300 border border-saffron/20"
                        aria-label="Scroll to top"
                    >
                        <ChevronUp size={20} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </footer>
    );
}
