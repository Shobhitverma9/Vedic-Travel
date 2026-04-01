'use client';



export default function WhyChooseUs() {
    const features = [
        {
            icon: <LotusIcon className="w-14 h-14" />,
            title: 'Curated Spiritual Experiences, Not Just Tours',
            description: 'We design meaningful spiritual journeys crafted around sacred traditions, authentic rituals, and culturally immersive experiences—going beyond standard itineraries to create transformational travel.',
        },
        {
            icon: <MapRouteIcon className="w-14 h-14" />,
            title: 'Tailor-Made Itineraries for Discerning Travelers',
            description: 'Every journey is personally customized to your preferences, pace, and spiritual interests—whether private darshan arrangements, exclusive temple access windows, or bespoke cultural experiences.',
        },
        {
            icon: <PremiumStarIcon className="w-14 h-14" />,
            title: 'Premium Comfort with Spiritual Depth',
            description: 'From handpicked luxury stays to seamless transport and priority arrangements, we ensure your focus remains on devotion and inner peace—not logistics.',
        },
        {
            icon: <LockShieldIcon className="w-14 h-14" />,
            title: 'Private & Exclusive Travel Options',
            description: 'We specialize in private departures, family spiritual retreats, and small curated groups for travelers who prefer comfort, privacy, and a deeper connection with each destination.',
        },
        {
            icon: <DiamondValueIcon className="w-14 h-14" />,
            title: 'Value Through Experience, Not Just Price',
            description: 'We focus on experience value—thoughtful inclusions, privileged access, and superior service quality—delivering journeys that are refined, meaningful, and memorable.',
        },
        {
            icon: <ConciergeIcon className="w-14 h-14" />,
            title: 'Seamless, End-to-End Journey Management',
            description: 'A dedicated Journey Concierge manages every detail—from planning to completion—ensuring effortless travel with discreet, personalized assistance.',
        },
    ];


    return (
        <section className="py-10 bg-gradient-to-b from-white to-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-deepBlue">
                        Why Plan Your <span className="font-sans italic text-saffron">Sacred Tours</span> With Us?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4">
                            <div className="mb-4 transition-transform duration-300 hover:scale-110">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-deepBlue mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-[320px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-cream rounded-full py-3 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left shadow-sm border border-saffron/10">
                        <div className="bg-deepBlue text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                            Dedicated Journey Concierge
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 text-sm md:text-base font-medium text-deepBlue">
                            <span>
                                <span className="font-bold">Email ID:</span> bookings@vedictravel.com
                            </span>
                            <span className="hidden md:inline text-gray-400">|</span>
                            <span>
                                <span className="font-bold">Contact No:</span> +91-8447470062
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Custom Flat SVGs ---

function LotusIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* Background Glow */}
            <circle cx="50" cy="50" r="45" fill="#FFF4E6" />
            <circle cx="50" cy="50" r="35" fill="#FFE0B2" />
            {/* Lotus Petals */}
            <path d="M50 30 C30 50, 20 70, 50 85 C80 70, 70 50, 50 30" fill="#FF8A65" />
            <path d="M48 35 C25 55, 10 75, 40 85 C60 70, 50 50, 48 35" fill="#FF7043" />
            <path d="M52 35 C75 55, 90 75, 60 85 C40 70, 50 50, 52 35" fill="#FFAB91" />
            <path d="M50 20 C20 45, 15 75, 50 90 C85 75, 80 45, 50 20" fill="#F4511E" opacity="0.9" />
            <circle cx="50" cy="80" r="6" fill="#FFD54F" />
        </svg>
    );
}

function MapRouteIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#E3F2FD" />
            {/* Map folded */}
            <path d="M25 30 L45 20 L65 30 L85 20 L85 70 L65 80 L45 70 L25 80 Z" fill="#BBDEFB" />
            <path d="M45 20 L65 30 L65 80 L45 70 Z" fill="#90CAF9" />
            {/* Route path */}
            <path d="M35 55 Q 50 40, 75 45" fill="none" stroke="#FF7043" strokeWidth="4" strokeDasharray="6 4" />
            {/* Pin */}
            <path d="M75 25 C65 25, 65 40, 75 50 C85 40, 85 25, 75 25 Z" fill="#F44336" />
            <circle cx="75" cy="33" r="3" fill="#FFFFFF" />
            <circle cx="35" cy="55" r="4" fill="#FF9800" />
        </svg>
    );
}

function PremiumStarIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#FFF8E1" />
            <polygon points="50,15 61,35 82,38 66,54 71,78 50,65 29,78 34,54 18,38 39,35" fill="#FFCA28" />
            <polygon points="50,15 61,35 82,38 66,54 71,78 50,65" fill="#FFB300" />
            {/* Sparkles */}
            <circle cx="25" cy="25" r="4" fill="#FFCA28" />
            <circle cx="75" cy="25" r="6" fill="#FFE082" />
            <circle cx="80" cy="65" r="3" fill="#FFCA28" />
            <circle cx="20" cy="60" r="5" fill="#FFE082" />
        </svg>
    );
}

function LockShieldIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#E8F5E9" />
            {/* Shield */}
            <path d="M50 15 L25 25 L25 50 C25 70, 50 85, 50 85 C50 85, 75 70, 75 50 L75 25 Z" fill="#81C784" />
            <path d="M50 15 L50 85 C50 85, 75 70, 75 50 L75 25 Z" fill="#66BB6A" />
            {/* Lock */}
            <path d="M40 45 L40 37 C40 30, 60 30, 60 37 L60 45" fill="none" stroke="#388E3C" strokeWidth="6" strokeLinecap="round" />
            <rect x="35" y="45" width="30" height="20" rx="3" fill="#FFFFFF" />
            <circle cx="50" cy="55" r="3" fill="#388E3C" />
            <path d="M48 55 L52 55 L50 60 Z" fill="#388E3C" />
        </svg>
    );
}

function DiamondValueIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#F3E5F5" />
            {/* Diamond shape */}
            <polygon points="50,85 20,45 35,25 65,25 80,45" fill="#BA68C8" />
            <polygon points="50,85 20,45 50,45" fill="#9C27B0" />
            <polygon points="50,85 50,45 80,45" fill="#AB47BC" />
            <polygon points="20,45 35,25 50,45" fill="#CE93D8" />
            <polygon points="80,45 65,25 50,45" fill="#E1BEE7" />
            <polygon points="50,45 35,25 65,25" fill="#F3E5F5" opacity="0.5" />
        </svg>
    );
}

function ConciergeIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#E0F7FA" />
            {/* Bell/Concierge */}
            <path d="M50 30 C35 30, 30 50, 30 65 L70 65 C70 50, 65 30, 50 30 Z" fill="#4DD0E1" />
            <path d="M50 30 C65 30, 70 50, 70 65 L50 65 Z" fill="#26C6DA" />
            {/* Bell top clapper */}
            <circle cx="50" cy="25" r="6" fill="#FFCA28" />
            {/* Base plate */}
            <rect x="20" y="65" width="60" height="8" rx="4" fill="#607D8B" />
            {/* Base reflection */}
            <rect x="50" y="65" width="30" height="8" rx="4" fill="#455A64" />
        </svg>
    );
}
