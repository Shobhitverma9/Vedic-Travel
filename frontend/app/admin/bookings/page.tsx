'use client';

import { useState, useEffect } from 'react';
import { bookingsService } from '@/services/bookings.service';


export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchBookings = async (page = 1) => {
        setLoading(true);
        try {
            const response = await bookingsService.getAllBookings({ page, limit: 10 });
            setBookings(response.bookings);
            setPagination({
                page: response.page,
                limit: 10,
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            fetchBookings(newPage);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-deepBlue">Manage Bookings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reference</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Package</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">Loading bookings...</td>
                                </tr>
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">No bookings found.</td>
                                </tr>
                            ) : (
                                bookings.map((booking: any) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-deepBlue">{booking.bookingReference}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="font-medium">
                                                {booking.billingAddress 
                                                    ? `${booking.billingAddress.firstName} ${booking.billingAddress.lastName}`
                                                    : (booking.user?.name || 'Guest')}
                                            </div>
                                            <div className="text-xs text-gray-400">{booking.email || booking.user?.email}</div>
                                            {booking.phone && <div className="text-[10px] text-gray-400">{booking.phone}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{booking.tour?.title}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(booking.travelDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹{booking.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-saffron hover:text-saffron-dark font-medium text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        {/* Detail Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-4 flex justify-between items-center text-white">
                            <h2 className="font-bold text-lg">Booking Details: {selectedBooking.bookingReference}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">&times; Close</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Section: Traveler & Package Info */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-[#FF5722] uppercase tracking-wider mb-4 pb-2 border-b">Package Info</h3>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Package:</span> <span className="font-semibold">{selectedBooking.tour?.title}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Travel Date:</span> <span className="font-semibold">{new Date(selectedBooking.travelDate).toLocaleDateString()}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-gray-500">Travelers:</span> <span className="font-semibold">{selectedBooking.numberOfTravelers}</span></div>
                                            <div className="flex justify-between text-sm pt-2 border-t font-bold text-deepBlue"><span>Paid Total:</span> <span>₹{selectedBooking.totalAmount.toLocaleString()}</span></div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-sm font-bold text-[#FF5722] uppercase tracking-wider mb-4 pb-2 border-b">Travelers</h3>
                                        <div className="space-y-3">
                                            {selectedBooking.travelerDetails?.map((t: any, i: number) => (
                                                <div key={i} className="bg-white border rounded-xl p-3 text-sm">
                                                    <p className="font-bold text-deepBlue">{t.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">{t.age} years | {t.gender}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Section: Billing Address */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-bold text-[#FF5722] uppercase tracking-wider mb-4 pb-2 border-b">Billing Address (Comm.)</h3>
                                        {selectedBooking.billingAddress ? (
                                            <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm leading-relaxed">
                                                <p className="font-bold text-deepBlue text-base">
                                                    {selectedBooking.billingAddress.title} {selectedBooking.billingAddress.firstName} {selectedBooking.billingAddress.lastName}
                                                </p>
                                                <div className="space-y-1">
                                                    <p>{selectedBooking.billingAddress.addressLine}</p>
                                                    <p>{selectedBooking.billingAddress.city}, {selectedBooking.billingAddress.state} - {selectedBooking.billingAddress.pincode}</p>
                                                </div>
                                                <div className="pt-3 border-t space-y-1">
                                                    <p><span className="text-gray-500">Email:</span> {selectedBooking.billingAddress.email}</p>
                                                    <p><span className="text-gray-500">Phone:</span> {selectedBooking.billingAddress.mobile}</p>
                                                    {selectedBooking.billingAddress.gst && <p><span className="text-green-600 font-bold">GST:</span> {selectedBooking.billingAddress.gst}</p>}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl border border-yellow-100 text-xs italic">
                                                No specific billing address was provided for this booking. Using registered email/phone if available.
                                            </div>
                                        )}
                                    </section>

                                    {selectedBooking.specialRequests && (
                                        <section>
                                            <h3 className="text-sm font-bold text-[#FF5722] uppercase tracking-wider mb-2 pb-2">Special Requests</h3>
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm text-gray-700 italic whitespace-pre-wrap leading-relaxed shadow-inner">
                                                "{selectedBooking.specialRequests}"
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-deepBlue text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all active:scale-95">Close Summary</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
