import Link from 'next/link';
import Image from 'next/image';

export default function NewYearHero() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <span className="text-saffron font-medium mb-4 block tracking-wide">— New Year 2026</span>
                        <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-deepBlue mb-8 leading-tight">
                            Rush into The New Year 2026 with Exciting Tour Packages & Deals
                        </h2>
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                            <p>
                                Explore exciting cultural and spiritual tour packages to brighten up your <strong className="text-deepBlue">New Year 2026</strong>.
                            </p>
                            <p>
                                From Mountain Paradise in Himachal Pradesh and Uttarakhand to Soaked with Devotion Tours to Varanasi, Prayagraj, Ayodhya.
                            </p>
                            <p>
                                Or, from Mesmerizing Kailash-Mansarovar Yatra to Adventurous Adi-Kailash and ChandraShila.
                            </p>
                            <p>
                                Or, from Divine Char Dham Yatra to Sacredly Cultural KhatuShyam Temple, Salasar Balaji Dham, and mighty forts in Jaipur.
                            </p>
                            <p className="font-bold text-deepBlue text-xl pt-2">
                                You Just Name It, And We Take You To Divine!
                            </p>
                        </div>
                    </div>

                    {/* Map Illustration */}
                    <div className="lg:w-1/2 relative flex justify-center">
                        {/* Using a placeholder for the map illustration as the asset is not available. 
                 The user can replace '/map-placeholder.png' with the actual asset.
             */}
                        <div className="relative w-full max-w-[600px] aspect-[4/3] bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center p-8 text-center">
                            <svg className="w-20 h-20 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm16 14H6.83l-1.93-3.21C4.4 15.06 5.89 14 7.5 14h9c1.61 0 3.1 1.06 2.6 1.79L17.17 19z" />
                            </svg>
                            <p className="text-blue-400 font-medium">Map of India Illustration</p>
                            <p className="text-sm text-blue-300 mt-2">Place 'map-india.png' in public folder</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
