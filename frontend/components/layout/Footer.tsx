"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronUp, ChevronRight, CreditCard, Landmark, Wallet, Globe, ShieldCheck, Lock } from 'lucide-react';

const paymentMethods = [
    {
        name: "Visa",
        label: "Visa",
        icon: (
            <img src="/Visa.jpg" alt="Visa" className="h-5 w-auto object-contain" />
        )
    },
    {
        name: "Mastercard",
        label: "Mastercard",
        icon: (
            <img src="/Mastercard-Logo.wine.png" alt="Mastercard" className="h-7 w-auto object-contain" />
        )
    },
    {
        name: "UPI",
        label: "UPI",
        icon: (
            <img src="/UPI.jpg" alt="UPI" className="h-5 w-auto object-contain mix-blend-multiply" />
        )
    },
    {
        name: "RuPay",
        label: "RuPay",
        icon: (
            <img src="/Rupay-Logo.webp" alt="RuPay" className="h-4 w-auto object-contain" />
        )
    },

    {
        name: "NetBanking",
        label: "Net Banking",
        icon: <Landmark size={20} className="text-[#1A1F71] group-hover:text-saffron transition-colors" />
    },
    {
        name: "Wallets",
        label: "EMI & Wallets",
        icon: <Wallet size={20} className="text-[#1A1F71] group-hover:text-saffron transition-colors" />
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
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "All Yatras", href: "/yatras" },
                { name: "Corporate Wellness", href: "/corporate-wellness" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
                { name: "Cancellation Policy", href: "/cancellation-policy" },
                { name: "Privacy Policy", href: "/privacy-policy" }
            ]
        },
        {
            title: "Our Services",
            links: [
                { name: "Flight Bookings", href: "/services/flight-bookings" },
                { name: "Hotel Reservations", href: "/services/hotel-reservations" },
                { name: "Visa Assistance", href: "/services/visa-assistance" },
                { name: "Cab Transfers", href: "/services/cab-transfers" },
                { name: "Travel Insurance", href: "/services/travel-insurance" },
                { name: "Customized Packages", href: "/tours/customized-packages" }
            ]
        },
        {
            title: "Top Tour Packages",
            links: [
                { name: "Char Dham Yatra Package", href: "/tours/char-dham-yatra-packages" },
                { name: "Kailash Mansarovar Yatra", href: "/tours/kailash-mansarovar-yatra-package" },
                { name: "Adi Kailash – Om Parvat", href: "/tours/adi-kailash-om-parvat-yatra" },
                { name: "Khatu Shyam – Salasar – Jaipur", href: "/tours/khatu-shyam-salasar-jaipur-yatra-packages" },
                { name: "UP Golden Triangle Yatra", href: "/tours/varanasi-ayodhya-prayagraj-golden-yatra-packages-vt" },
                { name: "Vaishno Devi Yatra", href: "/tours/vaishno-devi-yatra-package" },
                { name: "Jagannath Puri Yatra", href: "/tours/jagannath-puri-yatra-packages" }
            ]
        },
        {
            title: "Destinations",
            links: [
                { name: "Himalayan & North India", href: "/destinations/north-india" },
                { name: "Sacred South India", href: "/destinations/south-india" },
                { name: "Eastern Cultural Routes", href: "/destinations/east-india" },
                { name: "Royal Western India", href: "/destinations/west-india" },
                { name: "Central India Legacy", href: "/destinations/central-india" },
                { name: "International Vedic Tours", href: "/destinations/international" }
            ]
        },
        {
            title: "Knowledge Hub",
            links: [
                { name: "Varanasi Spiritual Guide", href: "/blogs/best-places-to-visit-in-varanasi-spiritual-guide" },
                { name: "Ayodhya Travel Guide", href: "/blogs/best-places-to-visit-in-ayodhya-travel-guide" },
                { name: "Himachal Family Tour Guide", href: "/blogs/guide-to-plan-himachal-pradesh-tour-with-family" },
                { name: "Jaipur Best Places & Budget Tips", href: "/blogs/jaipur-travel-guide-best-places-budget-tips" },
                { name: "Mysterious Temples in India", href: "/blogs/insanely-mysterious-temples-in-india-rituals" },
                { name: "All Travel Blogs", href: "/blogs" }
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
                        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-6">
                            {paymentMethods.map((method, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex flex-col items-center gap-2 group transition-all duration-300"
                                >
                                    {/* Responsive Icon Container */}
                                    <div className="h-8 min-w-[56px] px-3 bg-white rounded-md flex items-center justify-center shadow-sm border border-white/20 group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                                        <div className="flex items-center justify-center">
                                            {method.icon}
                                        </div>
                                    </div>
                                    {/* Indicative Label - Visible by Default */}
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gold transition-all duration-300">
                                        {method.label}
                                    </span>
                                </div>
                            ))}
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
