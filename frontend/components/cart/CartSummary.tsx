'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Tag } from 'lucide-react';
import { Cart } from '@/services/cart.service';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

interface CartSummaryProps {
    cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
    const router = useRouter();

    const subtotal = cart.total || 0;
    const gst = subtotal * 0.05; // 5% GST
    const total = subtotal + gst;

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span className="font-semibold">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-[#FF5722] whitespace-nowrap">₹{total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            {/* Discount Code (UI Only) */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Discount Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                        Apply
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Discount codes coming soon!</p>
            </div>

            <button
                onClick={handleCheckout}
                disabled={!cart.items || cart.items.length === 0}
                className="w-full bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-[#F4511E] hover:to-[#FF7043] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Proceed to Checkout
                <ArrowRight size={20} />
            </button>

            {!localStorage.getItem('token') && (
                <>
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <p className="text-center text-sm text-gray-600 mb-4">Verify with Google for faster checkout</p>
                    <GoogleLoginButton />
                </>
            )}

            <div className="mt-6 text-xs text-gray-500 text-center">
                <p>🔒 Secure checkout powered by PayU</p>
                <p className="mt-1">Your payment information is safe and secure</p>
            </div>
        </div>
    );
}
