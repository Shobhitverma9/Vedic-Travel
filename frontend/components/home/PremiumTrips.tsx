import Link from 'next/link';

export default function PremiumTrips() {
    return (
        <section className="py-20 bg-cream">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Content */}
                    <div className="lg:w-1/2 text-center lg:text-center">
                        <div className="flex justify-center mb-6">
                            <svg className="w-16 h-16 text-saffron" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a1 1 0 011 1v1.323l3.954-1.582 1.605 4.014-4.559 1.824V8.677l-4-1.6V7a1 1 0 011-1h1.323l3.954-1.582 1.605 4.014-4.559 1.824V8.677l-4-1.6V7a1 1 0 011-1H10z" />
                                <path fillRule="evenodd" d="M10 2a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2V4a2 2 0 012-2zm0 2a1 1 0 00-1 1v2h2V5a1 1 0 00-1-1z" clipRule="evenodd" />
                                {/* Placeholder for Crown Icon, using a generic shape */}
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                        </div>

                        <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-deepBlue mb-6">
                            Premium Trips
                        </h2>

                        <p className="text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
                            Fully Customized Premium Vedic Tour Packages, exclusively for the ones, who prefer their trips with Sheer Luxury and Comfort.
                        </p>

                        <div className="flex justify-center gap-12 text-saffron">
                            {/* Phone */}
                            <Link href="tel:+918447470062" className="hover:text-deepBlue transition-colors">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                            </Link>
                            {/* Whatsapp */}
                            <Link href="https://wa.me/918447470062" className="hover:text-deepBlue transition-colors">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            {/* Email */}
                            <Link href="mailto:support@vedictravel.com" className="hover:text-deepBlue transition-colors">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="lg:w-1/2">
                        <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden relative group">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
                                <span>Palace / Premium Place Image</span>
                            </div>
                            {/* 
                    If user adds 'premium-trip.jpg' in public, we can use it.
                  */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
