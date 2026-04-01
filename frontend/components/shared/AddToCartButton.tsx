'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Calendar } from 'lucide-react';
import { cartService } from '@/services/cart.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    tour: {
        _id: string;
        title: string;
        price: number;
    };
    onAddToCart?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary';
    showModal?: boolean;
    label?: string;
}

export default function AddToCartButton({
    tour,
    onAddToCart,
    className = '',
    variant = 'primary',
    showModal = true,
    label,
}: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [travelDate, setTravelDate] = useState('');
    const router = useRouter();

    const variantClasses = {
        primary: 'bg-gradient-to-r from-[#FF5722] to-[#FF8A65] hover:from-[#F4511E] hover:to-[#FF7043] text-white',
        secondary: 'bg-white border-2 border-[#FF5722] text-[#FF5722] hover:bg-[#FF5722] hover:text-white',
    };

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (showModal) {
            setShowDateModal(true);
        } else {
            // Add with today's date + 7 days as default
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 7);
            handleAddToCart(1, defaultDate.toISOString().split('T')[0]);
        }
    };

    const handleAddToCart = async (qty: number, date: string) => {
        setIsAdding(true);
        try {
            await cartService.addToCart(tour, qty, date);
            setShowSuccess(true);
            toast.success('Added to cart successfully');
            setShowDateModal(false);
            if (onAddToCart) onAddToCart();

            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!travelDate) {
            alert('Please select a travel date');
            return;
        }
        handleAddToCart(quantity, travelDate);
    };

    // Get tomorrow's date as minimum date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <>
            <button
                onClick={handleClick}
                disabled={isAdding || showSuccess}
                className={`
                    ${variantClasses[variant]}
                    px-6 py-3 rounded-lg font-semibold
                    transition-all duration-300
                    flex items-center gap-2
                    disabled:opacity-70 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg
                    ${className}
                `}
            >
                {showSuccess ? (
                    <>
                        <Check size={20} />
                        Added to Cart
                    </>
                ) : (
                    <>
                        <ShoppingCart size={20} />
                        {isAdding ? 'Adding...' : (label || 'Add to Cart')}
                    </>
                )}
            </button>

            {/* Date Selection Modal */}
            {showDateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300" onClick={() => setShowDateModal(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{tour.title}</h3>
                        <form onSubmit={handleModalSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Number of Travelers
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    min="1"
                                    max="50"
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Travel Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        // Clicking anywhere on the input should trigger the picker
                                        onClick={(e) => {
                                            try {
                                                (e.currentTarget as any).showPicker();
                                            } catch (err) {
                                                // Fallback for browsers not supporting showPicker
                                            }
                                        }}
                                        min={minDate}
                                        required
                                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none bg-white cursor-pointer"
                                    />
                                    <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                                        <Calendar size={20} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <p className="text-lg font-bold text-gray-900">
                                    Total: ₹{(tour.price * quantity).toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDateModal(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isAdding}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white rounded-lg font-semibold hover:from-[#F4511E] hover:to-[#FF7043] transition-all disabled:opacity-50"
                                >
                                    {isAdding ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
