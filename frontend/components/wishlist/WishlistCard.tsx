'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Calendar, ShoppingCart } from 'lucide-react';
import { WishlistItem } from '@/services/wishlist.service';
import { cartService } from '@/services/cart.service';
import { useRouter } from 'next/navigation';

interface WishlistCardProps {
    tour: WishlistItem;
    onRemove: (tourId: string) => void;
}

export default function WishlistCard({ tour, onRemove }: WishlistCardProps) {
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [travelDate, setTravelDate] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const handleAddToCart = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!travelDate) {
            alert('Please select a travel date');
            return;
        }

        setIsAdding(true);
        try {
            await cartService.addToCart(tour, quantity, travelDate);
            setShowModal(false);
            router.push('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart');
        } finally {
            setIsAdding(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <Link href={`/package/${tour.slug}`} className="relative h-48 overflow-hidden block">
                    <Image
                        src={tour.images?.[0] || '/placeholder-tour.jpg'}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(tour._id);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors z-10"
                        aria-label="Remove from wishlist"
                    >
                        <Heart size={20} className="fill-red-500 text-red-500" />
                    </button>
                </Link>

                <div className="p-6">
                    <Link href={`/package/${tour.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-saffron transition-colors">
                            {tour.title}
                        </h3>
                    </Link>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{tour.duration} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span className="line-clamp-1">{tour.locations?.join(', ')}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-2xl font-bold text-[#FF5722]">
                                ₹{tour.price?.toLocaleString('en-IN') || '0'}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/ person</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white px-4 py-3 rounded-lg font-semibold hover:from-[#F4511E] hover:to-[#FF7043] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={18} />
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Add to Cart Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{tour.title}</h3>
                        <form onSubmit={handleAddToCart} className="space-y-6">
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
                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    min={minDate}
                                    required
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <p className="text-lg font-bold text-gray-900">
                                    Total: ₹{((tour.price || 0) * quantity).toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
