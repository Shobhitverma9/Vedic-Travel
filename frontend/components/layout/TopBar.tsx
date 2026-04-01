import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, Twitter, MapPin } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="bg-[#1a1a2e] text-gray-300 py-1.5 border-b border-white/5 hidden md:block">
            <div className="container mx-auto px-4 flex justify-between items-center text-[13px] font-medium tracking-wide">
                {/* Left Side: Contact Info */}
                <div className="flex items-center space-x-6">
                    <a href="mailto:bookings@vedictravel.com" className="flex items-center hover:text-saffron transition-colors group">
                        <Mail className="w-3.5 h-3.5 mr-2 text-saffron opacity-80 group-hover:opacity-100" />
                        <span>bookings@vedictravel.com</span>
                    </a>
                    <a href="tel:+918447470062" className="flex items-center hover:text-saffron transition-colors group">
                        <Phone className="w-3.5 h-3.5 mr-2 text-saffron opacity-80 group-hover:opacity-100" />
                        <span>+91-8447470062</span>
                    </a>
                    <div className="flex items-center text-gray-400">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-saffron opacity-80" />
                        <span>New Delhi, India</span>
                    </div>
                </div>

                {/* Right Side: Social & Utility */}
                <div className="flex items-center space-x-4">
                    {/* Divider */}
                    <div className="h-3 w-px bg-white/10 hidden lg:block"></div>

                    {/* Social Icons */}
                    <div className="flex items-center space-x-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-1.5 rounded-full hover:bg-saffron hover:text-white transition-all duration-300">
                            <Facebook className="w-3.5 h-3.5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-1.5 rounded-full hover:bg-saffron hover:text-white transition-all duration-300">
                            <Twitter className="w-3.5 h-3.5" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-1.5 rounded-full hover:bg-saffron hover:text-white transition-all duration-300">
                            <Instagram className="w-3.5 h-3.5" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-1.5 rounded-full hover:bg-saffron hover:text-white transition-all duration-300">
                            <Youtube className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
