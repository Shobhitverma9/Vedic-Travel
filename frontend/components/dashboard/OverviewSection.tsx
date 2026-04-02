'use client';

import React from 'react';
import { 
    LayoutDashboard, 
    Calendar, 
    Heart, 
    Users, 
    ChevronRight, 
    MapPin, 
    Star, 
    Trophy, 
    Clock,
    Plus,
    Compass
} from 'lucide-react';
import Link from 'next/link';

interface OverviewSectionProps {
    user: any;
    bookings: any[];
    wishlist: any[];
    setActiveTab: (tab: string) => void;
}

export default function OverviewSection({ user, bookings, wishlist, setActiveTab }: OverviewSectionProps) {
    const travellersCount = user?.travellers?.length || 0;
    
    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const stats = [
        { 
            id: 'bookings', 
            label: 'Total Bookings', 
            count: bookings.length, 
            icon: Calendar, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
        },
        { 
            id: 'wishlist', 
            label: 'Saved Tours', 
            count: wishlist.length, 
            icon: Heart, 
            color: 'text-red-600', 
            bg: 'bg-red-50' 
        },
        { 
            id: 'travellers', 
            label: 'Travellers', 
            count: travellersCount, 
            icon: Users, 
            color: 'text-orange-600', 
            bg: 'bg-orange-50' 
        },
        { 
            id: 'profile', 
            label: 'Profile Status', 
            count: user?.phoneVerified ? '100%' : '70%', 
            icon: Trophy, 
            color: 'text-amber-500', 
            bg: 'bg-amber-50' 
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-white/80 max-w-md">Welcome back to your VedicTravel dashboard. Ready for your next spiritual journey?</p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <Link 
                            href="/tours" 
                            className="bg-white text-orange-600 px-6 py-2.5 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Compass className="w-5 h-5" />
                            Explore Tours
                        </Link>
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-xl font-medium hover:bg-white/30 transition-all"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
                {/* Decorative background circle */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <button
                        key={stat.id}
                        onClick={() => setActiveTab(stat.id)}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group text-left"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Preview */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <button onClick={() => setActiveTab('bookings')} className="text-orange-600 font-medium text-sm hover:underline">
                            View All
                        </button>
                    </div>

                    {bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.slice(0, 2).map((booking) => (
                                <div key={booking._id} className="flex gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                                    <div className="w-24 h-20 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                                        {booking.tour?.images?.[0] && (
                                            <img src={booking.tour.images[0]} alt={booking.tour.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{booking.tour?.title}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                                            </div>
                                            <span className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {booking.bookingStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500 mb-4">No bookings found</p>
                            <Link href="/tours" className="text-orange-600 font-semibold flex items-center gap-1">
                                Start your first journey <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions / Profile Progress */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => setActiveTab('travellers')}
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100"
                            >
                                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">Add New Traveller</span>
                            </button>
                            <Link 
                                href="/wishlist" 
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                            >
                                <div className="p-2 bg-red-100 rounded-xl text-red-600">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">View Saved Tours</span>
                            </Link>
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-amber-50 text-gray-700 hover:text-amber-600 transition-all border border-transparent hover:border-amber-100"
                            >
                                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                                    <Users className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">Update Profile Details</span>
                            </button>
                        </div>
                    </div>

                    {/* Fun Stat or Banner */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold mb-1">Exclusive Offers! 🕊️</h3>
                            <p className="text-white/70 text-xs mb-4">Complete your 3rd trip and unlock premium perks.</p>
                            <button className="text-xs font-bold bg-white text-indigo-700 px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                                Learn More
                            </button>
                        </div>
                        <Star className="absolute top-[-10px] right-[-10px] w-20 h-20 text-white/10 rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
}
