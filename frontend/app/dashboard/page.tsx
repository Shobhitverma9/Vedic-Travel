'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { bookingsService } from '@/services/bookings.service';
import { wishlistService } from '@/services/wishlist.service';
import Link from 'next/link';
import { Calendar, Heart, MapPin, Clock } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import ProfileSection from '@/components/dashboard/ProfileSection';
import TravellersSection from '@/components/dashboard/TravellersSection';

interface Booking {
    _id: string;
    bookingReference: string;
    tour: {
        title: string;
        images: string[];
        duration: number;
    };
    travelDate: string;
    bookingStatus: string;
    paymentStatus: string;
    numberOfTravelers: number;
    totalAmount: number;
}

interface WishlistItem {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    price: number;
    duration: number;
    location: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tab = params.get('tab');
            if (tab) {
                setActiveTab(tab);
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);

                const [bookingsData, wishlistData] = await Promise.all([
                    bookingsService.getUserBookings(),
                    wishlistService.getWishlist()
                ]);

                // bookingsData is a paginated object { bookings: [], total, ... }
                const bookingsArray = bookingsData?.bookings || bookingsData;
                setBookings(Array.isArray(bookingsArray) ? bookingsArray : []);
                setWishlist(Array.isArray(wishlistData) ? wishlistData : []);

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                // If fetching user fails with 401, redirect.
                if ((error as any)?.response?.status === 401) {
                    router.push('/auth/signin');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push('/');
    };

    const handleUserUpdate = (updatedUser: any) => {
        setUser(updatedUser);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <DashboardLayout>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1">
                <div className="min-h-[500px]">
                    {activeTab === 'profile' && (
                        <ProfileSection user={user} onUpdate={handleUserUpdate} />
                    )}

                    {activeTab === 'travellers' && (
                        <TravellersSection user={user} onUpdate={handleUserUpdate} />
                    )}

                    {activeTab === 'bookings' && (
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>
                            {bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <Link href={`/dashboard/bookings/${booking._id}`} key={booking._id} className="block hover:no-underline">
                                            <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white">
                                                <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                                    {booking.tour?.images && booking.tour.images[0] && (
                                                        <img src={booking.tour.images[0]} alt={booking.tour.title} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-900">{booking.tour?.title || 'Unknown Tour'}</h3>
                                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {booking.travelDate ? new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {booking.numberOfTravelers} Traveller(s)
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-medium">Total:</span>
                                                            ₹{booking.totalAmount?.toLocaleString('en-IN')}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-3 text-sm">
                                                        <span className="font-medium">Status: <span className={`capitalize ${booking.bookingStatus === 'confirmed' ? 'text-green-600' :
                                                            booking.bookingStatus === 'pending' ? 'text-orange-600' : 'text-red-500'
                                                            }`}>{booking.bookingStatus}</span></span>
                                                        {booking.bookingReference && (
                                                            <span className="text-gray-400 text-xs font-mono"># {booking.bookingReference}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end md:justify-center md:px-4">
                                                    <span className="text-orange-600 font-medium text-sm">View Details &rarr;</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                                    <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
                                    <Link href="/tours" className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                                        Browse Tours
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'wishlist' && (
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                            {wishlist.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {wishlist.map((item) => (
                                        <div key={item._id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white pointer-events-auto">
                                            <div className="h-48 bg-gray-200 relative group">
                                                {item.images && item.images[0] && (
                                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-white p-1.5 rounded-full shadow-sm text-red-500">
                                                        <Heart className="w-4 h-4 fill-current" />
                                                    </div>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                                    <div className="flex items-center gap-1 text-white text-xs">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{item.location || 'India'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2 truncate">{item.title}</h3>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="font-bold text-orange-600">₹{item.price?.toLocaleString()}</span>
                                                    <Link href={`/tours/${item.slug}`} className="text-sm font-medium text-purple hover:text-purple-700">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
                                    <p className="text-gray-500 mb-6">Save tours you're interested in to view them here.</p>
                                    <Link href="/tours" className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors">
                                        Explore Tours
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
