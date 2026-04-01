'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, Phone } from 'lucide-react';

export default function PaymentFailurePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    {/* Failure Icon */}
                    <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                        <XCircle className="w-20 h-20 text-red-600" />
                    </div>

                    {/* Failure Message */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We couldn't process your payment. Please try again.
                    </p>

                    {/* Reasons */}
                    <div className="bg-red-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-gray-900 mb-4">Common Reasons for Failure:</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Insufficient balance in your account</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Incorrect card details or expired card</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Payment gateway timeout or network issue</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Transaction declined by your bank</span>
                            </li>
                        </ul>
                    </div>

                    {/* What to Do */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-gray-900 mb-4">What You Can Do:</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
                                <span>Check your account balance and card details</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
                                <span>Try using a different payment method</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#FF5722] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
                                <span>Contact your bank if the issue persists</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => router.push('/cart')}
                            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Return to Cart
                        </button>
                        <button
                            onClick={() => router.push('/checkout')}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white rounded-lg font-semibold hover:from-[#F4511E] hover:to-[#FF7043] transition-all"
                        >
                            Try Again
                        </button>
                    </div>

                    {/* Support */}
                    <div className="mt-8 pt-8 border-t">
                        <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                            <Phone size={18} className="text-[#FF5722]" />
                            <span className="font-semibold">Need Immediate Help?</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Call us at{' '}
                            <a href="tel:+911234567890" className="text-[#FF5722] font-semibold">
                                +91 123-456-7890
                            </a>
                            {' '}or email{' '}
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
