'use client';

import Link from 'next/link';
import { User, Calendar, Heart, LogOut, Users, MapPin } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    user: any;
    handleLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, handleLogout }: SidebarProps) {
    const menuItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'travellers', label: 'Travellers', icon: Users },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
    ];

    return (
        <div className="w-full md:w-64 mb-8 md:mb-0 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-semibold text-gray-900 truncate">{user?.name}</h2>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id
                                ? 'bg-orange-50 text-orange-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                    <hr className="my-4 border-gray-100" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </nav>
            </div>
        </div>
    );
}
