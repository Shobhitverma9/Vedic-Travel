'use client';

import React from 'react';
import { X, Info } from 'lucide-react';

interface PriceBreakupProps {
    isOpen: boolean;
    onClose: () => void;
    breakup: {
        basePrice: number;
        surcharge: number;
        gst: number;
        total: number;
        travelers: number;
    };
}

const PriceBreakup: React.FC<PriceBreakupProps> = ({ isOpen, onClose, breakup }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] p-4 text-sm animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
                <h4 className="font-bold text-deepBlue">Fare Price Break-up</h4>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare ({breakup.travelers} Travelers)</span>
                    <span className="font-medium">₹ {(breakup.basePrice * breakup.travelers).toLocaleString()}</span>
                </div>
                {breakup.surcharge > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">City Surcharge</span>
                        <span className="font-medium">₹ {(breakup.surcharge * breakup.travelers).toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ₹ 0</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="font-medium">₹ {breakup.gst.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between items-center">
                    <span className="font-bold text-deepBlue">Total Price</span>
                    <span className="font-bold text-xl text-deepBlue">₹ {breakup.total.toLocaleString()}</span>
                </div>
            </div>

            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45"></div>
        </div>
    );
};

export default PriceBreakup;
