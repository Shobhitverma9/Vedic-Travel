'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import Preloader from '@/components/shared/Preloader';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [bookingIds, setBookingIds] = useState<string[]>([]);

    useEffect(() => {
        const ids = searchParams.get('bookings');
        if (ids) {
            setBookingIds(ids.split(','));
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Success Icon */}
                    <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-20 h-20 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Payment Successful!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your spiritual journey has been confirmed
                    </p>

                    {/* Booking References */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
                        <h2 className="font-semibold text-gray-900mb-3">Booking Reference{bookingIds.length > 1 ? 's' : ''}</h2>
                        <div className="space-y-2">
                            {bookingIds.map((id, index) => (
                                <p key={index} className="text-lg font-mono text-green-600">
                                    {id}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                                <span>A confirmation email has been sent to your registered email address</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                                <span>Our team will contact you within 24 hours with detailed itinerary</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                                <span>You can view your booking details in the My Bookings section</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 px-6 py-3 bg-white border-2 border-[#FF5722] text-[#FF5722] rounded-lg font-semibold hover:bg-[#FF5722] hover:text-white transition-all text-center"
                        >
                            Explore More Tours
                        </Link>
                        <button
                            onClick={() => router.push('/')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white rounded-lg font-semibold hover:from-[#F4511E] hover:to-[#FF7043] transition-all flex items-center justify-center gap-2"
                        >
                            Go to Home
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Support */}
                    <div className="mt-8 pt-8 border-t">
                        <p className="text-sm text-gray-600">
                            Need help? Contact us at{' '}
                            <a href="mailto:support@vedictravel.com" className="text-[#FF5722] font-semibold">
                                support@vedictravel.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
