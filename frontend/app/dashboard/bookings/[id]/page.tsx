'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { bookingsService } from '@/services/bookings.service';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import { authService } from '@/services/auth.service';
import Link from 'next/link';
import {
    Calendar, Clock, MapPin, Users, CreditCard,
    ChevronLeft, Info, CheckCircle, AlertTriangle, XCircle, FileText
} from 'lucide-react';
import Image from 'next/image';

interface BookingDetails {
    _id: string;
    bookingReference: string;
    tour: {
        _id: string;
        title: string;
        images: string[];
        slug: string;
        duration: number;
        itinerary?: {
            day: number;
            title: string;
            description: string;
            items?: {
                type: string;
                title?: string;
                description?: string;
            }[];
        }[];
        cancellationPolicy?: string;
        hotels?: any[];
        inclusions?: string[];
        exclusions?: string[];
    };
    travelDate: string;
    bookingStatus: string;
    paymentStatus: string;
    numberOfTravelers: number;
    totalAmount: number;
    paidAmount: number;
    travelerDetails: {
        name: string;
        age: number;
        gender: string;
    }[];
    specialRequests?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    paymentId?: string;
    paymentMethod?: string;
    emiDetails?: {
        bank: string;
        tenure: number;
        monthlyAmount: number;
    };
    createdAt: string;
}

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);

                const data = await bookingsService.getBookingById(id);
                setBooking(data);
            } catch (err: any) {
                console.error('Failed to fetch booking:', err);
                if (err?.response?.status === 401) {
                    router.push('/auth/signin');
                } else {
                    setError('Failed to load booking details.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id, router]);

    const handleLogout = () => {
        authService.logout();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-orange-50/30">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <DashboardLayout>
                <Sidebar activeTab="bookings" setActiveTab={() => { }} user={user} handleLogout={handleLogout} />
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm min-h-[500px]">
                    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error || 'Please login to view this page.'}</p>
                    <Link href="/dashboard" className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) return null;

    const startDate = new Date(booking.travelDate);
    const endDate = new Date(startDate);
    if (booking.tour?.duration) {
        endDate.setDate(endDate.getDate() + booking.tour.duration - 1);
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'partial': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return <CheckCircle className="w-5 h-5 mr-1" />;
            case 'pending': return <Clock className="w-5 h-5 mr-1" />;
            case 'cancelled': return <XCircle className="w-5 h-5 mr-1" />;
            default: return <Info className="w-5 h-5 mr-1" />;
        }
    };

    return (
        <DashboardLayout>
            <Sidebar activeTab="bookings" setActiveTab={() => router.push('/dashboard?tab=bookings')} user={user} handleLogout={handleLogout} />

            <div className="flex-1 space-y-6 max-w-5xl mx-auto w-full">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard?tab=bookings" className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back to Bookings
                    </Link>
                    {booking.tour?.slug && (
                        <Link href={`/tours/${booking.tour.slug}`} className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4">
                            View Tour Package
                        </Link>
                    )}
                </div>

                {/* Main Hero Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="relative h-48 md:h-64 bg-gray-200 w-full">
                        {booking.tour?.images?.[0] ? (
                            <Image
                                src={booking.tour.images[0]}
                                alt={booking.tour.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-90 shadow-inner"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{booking.tour?.title || 'Tour Details'}</h1>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-200">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {booking.tour?.duration ? `${booking.tour.duration} Days` : 'N/A'} Tour
                                        </div>
                                        <div className="flex items-center font-mono bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                            Ref: {booking.bookingReference}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-4 py-1.5 rounded-full border shadow-sm flex items-center font-medium capitalize backdrop-blur-md ${getStatusColor(booking.bookingStatus)}`}>
                                        {getStatusIcon(booking.bookingStatus)}
                                        {booking.bookingStatus}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100 bg-gray-50/50">
                        <div className="p-4 flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Date of Travel</span>
                            <span className="font-semibold text-gray-900">{startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="p-4 flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center"><Users className="w-3 h-3 mr-1" /> Guests</span>
                            <span className="font-semibold text-gray-900">{booking.numberOfTravelers} Traveler(s)</span>
                        </div>
                        <div className="p-4 flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center"><CreditCard className="w-3 h-3 mr-1" /> Total Amount</span>
                            <span className="font-bold text-gray-900 text-lg">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-4 flex flex-col">
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Payment Status</span>
                             <span className={`font-semibold capitalize ${booking.paymentStatus === 'success' ? 'text-green-600' : booking.paymentStatus === 'partial' ? 'text-blue-600' : 'text-orange-500'}`}>
                                {booking.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Details & Itinerary */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Cancellation Info Banner if Cancelled */}
                        {booking.bookingStatus === 'cancelled' && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4 items-start shadow-sm">
                                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-800">Booking Cancelled</h3>
                                    <p className="text-red-700 mt-1 text-sm">
                                        This booking was cancelled on {new Date(booking.cancelledAt || Date.now()).toLocaleDateString('en-IN')}.
                                    </p>
                                    {booking.cancellationReason && (
                                        <p className="text-red-700 mt-1 text-sm italic">
                                            Reason: "{booking.cancellationReason}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Itinerary Section */}
                        {booking.tour?.itinerary && booking.tour.itinerary.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                                    Your Tour Itinerary
                                </h2>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {booking.tour.itinerary.map((day, idx) => {
                                        const date = new Date(startDate);
                                        date.setDate(startDate.getDate() + day.day - 1);
                                        return (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                {/* Icon Maker */}
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-100 text-orange-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                                                    D{day.day}
                                                </div>
                                                {/* Card */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 mb-2">{day.title}</h3>
                                                    <p className="text-sm text-gray-600 line-clamp-3 hover:line-clamp-none transition-all">{day.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Travelers List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-blue-500" />
                                Traveler Information
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-sm font-medium text-gray-500">
                                            <th className="pb-3 px-4">#</th>
                                            <th className="pb-3 px-4">Name</th>
                                            <th className="pb-3 px-4">Age</th>
                                            <th className="pb-3 px-4">Gender</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {booking.travelerDetails?.map((t, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                                                <td className="py-3 px-4 font-medium text-gray-900">{t.name}</td>
                                                <td className="py-3 px-4 text-gray-600">{t.age} yrs</td>
                                                <td className="py-3 px-4 capitalize text-gray-600">{t.gender}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Policies & Support */}
                    <div className="space-y-6">
                        {/* Transaction Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center border-b pb-3">
                                <FileText className="w-4 h-4 mr-2" /> Billing Information
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Booking Date</span>
                                    <span className="font-medium text-gray-900">{new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                {booking.paymentId && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Payment ID</span>
                                        <span className="font-medium font-mono text-gray-900">{booking.paymentId}</span>
                                    </div>
                                )}
                                {booking.paymentMethod && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Payment Method</span>
                                        <span className="font-medium capitalize text-gray-900">{booking.paymentMethod}</span>
                                    </div>
                                )}
                                {booking.emiDetails && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100 flex flex-col gap-1">
                                        <div className="flex justify-between text-[11px] text-blue-800">
                                            <span>EMI Plan</span>
                                            <span className="font-bold">{booking.emiDetails.bank} - {booking.emiDetails.tenure} Months</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-blue-800">
                                            <span>Monthly Installment</span>
                                            <span className="font-bold">₹{booking.emiDetails.monthlyAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                )}
                                 <div className="flex justify-between text-gray-600 pt-3 border-t border-gray-100">
                                    <span>Cumulative Paid</span>
                                    <span className="font-bold text-gray-900">₹{(booking.paidAmount || 0)?.toLocaleString('en-IN')}</span>
                                </div>
                                {booking.totalAmount > (booking.paidAmount || 0) && (
                                    <div className="flex justify-between text-orange-600 font-medium">
                                        <span>Balance Due</span>
                                        <span>₹{(booking.totalAmount - (booking.paidAmount || 0))?.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                                <h3 className="font-semibold text-blue-900 mb-2 text-sm flex items-center">
                                    <Info className="w-4 h-4 mr-1.5" /> Special Requests
                                </h3>
                                <p className="text-sm text-blue-800 italic">"{booking.specialRequests}"</p>
                            </div>
                        )}

                        {/* Cancellation & Refund Policy */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-4 border-b pb-3">Cancellation &amp; Refund Policy</h3>

                            {booking.tour?.cancellationPolicy ? (
                                <div className="text-sm text-gray-600 whitespace-pre-wrap">{booking.tour.cancellationPolicy}</div>
                            ) : (
                                <div className="space-y-3 text-sm text-gray-600">
                                    <p className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                                        Cancellations made 30 days or more prior to departure: 100% refund (minus processing fees).
                                    </p>
                                    <p className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                                        Cancellations made 15-29 days prior: 50% refund.
                                    </p>
                                    <p className="flex items-start">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                                        Cancellations made within 14 days of departure: No refund.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500">
                                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                                        <p>Refunds are processed to the original payment method within 7-10 business days.</p>
                                    </div>
                                </div>
                            )}

                            {booking.bookingStatus !== 'cancelled' && (
                                <div className="mt-6">
                                    <p className="text-xs text-gray-500 mb-2">Need to change your plans?</p>
                                    <button
                                        onClick={() => {
                                            alert("Contact support at support@vedictravel.com or +91 84474 70062 to initiate cancellation.");
                                        }}
                                        className="w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                                        Request Cancellation
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Customer Support */}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">Contact our travel experts for assistance with this booking.</p>
                            <div className="space-y-2 text-sm font-medium">
                                <a href="tel:+918447470062" className="flex items-center text-orange-600 hover:text-orange-700">
                                    📞 +91 84474 70062
                                </a>
                                <a href="mailto:support@vedictravel.com" className="flex items-center text-orange-600 hover:text-orange-700">
                                    ✉️ support@vedictravel.com
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
