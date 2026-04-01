'use client';

import { ShoppingBag, Lock } from 'lucide-react';
import { Cart } from '@/services/cart.service';

interface OrderSummaryProps {
    cart: Cart;
    subtotal: number;
    gst: number;
    total: number;
}

export default function OrderSummary({ cart, subtotal, gst, total }: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 line-clamp-1">{item.tour.title}</p>
                            <p className="text-gray-500 text-xs">
                                {item.quantity} travelers
                            </p>
                        </div>
                        <div className="text-right ml-2">
                            <p className="font-semibold text-gray-900">
                                ₹{(item.priceSnapshot * item.quantity).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span className="font-semibold">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#FF5722] whitespace-nowrap">₹{total.toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Lock size={16} className="text-[#FF5722]" />
                    <span className="text-sm font-semibold text-gray-900">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-600">
                    Your payment information is encrypted and secure. Powered by PayU.
                </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShoppingBag size={14} />
                <span>{cart.itemCount} item(s) in cart</span>
            </div>
        </div>
    );
}
