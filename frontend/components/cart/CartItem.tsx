'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '@/services/cart.service';
import { toast } from 'sonner';

interface CartItemProps {
    item: CartItemType;
    index: number;
    onUpdate: (index: number, quantity?: number, travelDate?: string) => void;
    onRemove: (index: number) => void;
}

export default function CartItem({ item, index, onUpdate, onRemove }: CartItemProps) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [travelDate, setTravelDate] = useState(
        new Date(item.travelDate).toISOString().split('T')[0]
    );
    const [isUpdating, setIsUpdating] = useState(false);

    const tour = item.tour;

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        setIsUpdating(true);
        try {
            await onUpdate(index, newQuantity, undefined);
            toast.success('Cart updated');
        } catch (error) {
            toast.error('Failed to update cart');
        }
        setIsUpdating(false);
    };

    const handleDateChange = async (newDate: string) => {
        setTravelDate(newDate);
        try {
            await onUpdate(index, undefined, newDate);
            toast.success('Travel date updated');
        } catch (error) {
            toast.error('Failed to update travel date');
        }
        setIsUpdating(false);
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex gap-6">
                    {/* Tour Image */}
                    <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                            src={tour.images?.[0] || '/placeholder-tour.jpg'}
                            alt={tour.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Tour Details */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {tour.duration} days
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        {tour.locations?.slice(0, 2).join(', ')}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    onRemove(index);
                                    toast.success('Item removed from cart');
                                }}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                aria-label="Remove item"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Travelers Counter */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Users size={16} className="inline mr-1" />
                                    Travelers
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={isUpdating || quantity <= 1}
                                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={isUpdating}
                                        className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Travel Date */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Travel Date
                                </label>
                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    min={minDate}
                                    disabled={isUpdating}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                ₹{item.priceSnapshot.toLocaleString('en-IN')} × {quantity}
                            </div>
                            <div className="text-2xl font-bold text-[#FF5722] whitespace-nowrap">
                                ₹{(item.priceSnapshot * quantity).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
