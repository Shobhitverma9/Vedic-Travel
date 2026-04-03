'use client';

import { Info, MapPin, Users, Calendar, Tag, Package } from 'lucide-react';

interface ReviewStepProps {
    bookingDetails: {
        tourName: string;
        tourType: string;
        packageType: string;
        travelDate: Date;
        adults: number;
        costPerAdult: number;
        currency: string;
        exchangeRate: number;
    };
    onContinue: () => void;
}

export default function ReviewStep({ bookingDetails, onContinue }: ReviewStepProps) {
    const {
        tourName,
        tourType,
        packageType,
        travelDate,
        adults,
        costPerAdult,
        currency,
        exchangeRate
    } = bookingDetails;

    const baseAmountInINR = costPerAdult; // Price is already in INR from the backend
    const totalTourCost = baseAmountInINR * adults;
    const gstRate = 0.05;
    const gstAmount = totalTourCost * gstRate;
    const grandTotal = totalTourCost + gstAmount;

    const formattedDate = new Date(travelDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const rows = [
        { icon: <MapPin size={15} className="text-saffron" />, label: 'Starting From', value: 'Joining Direct' },
        { icon: <Tag size={15} className="text-saffron" />, label: 'Tour Type', value: tourType },
        { icon: <Package size={15} className="text-saffron" />, label: 'Package Type', value: packageType },
        { icon: <Calendar size={15} className="text-saffron" />, label: 'Date of Travel', value: formattedDate },
        { icon: <Users size={15} className="text-saffron" />, label: 'Travellers', value: `Room 1 — ${adults} Adult${adults > 1 ? 's' : ''}` },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Booking Summary */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    {/* Card header */}
                    <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-4">
                        <h2 className="text-white font-bold text-lg tracking-wide">Booking Summary</h2>
                    </div>

                    <div className="p-6">
                        {/* Tour Name */}
                        <p className="text-[#1A2332] font-semibold text-base leading-snug mb-6 border-l-4 border-[#FF5722] pl-4">
                            {tourName}
                        </p>

                        {/* Details Grid */}
                        <div className="divide-y divide-gray-100">
                            {rows.map((row, i) => (
                                <div key={i} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        {row.icon}
                                        {row.label}
                                    </div>
                                    <span className="font-medium text-[#1A2332] text-sm text-right">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Fare Breakup */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF5722] to-[#D4AF37] px-6 py-4">
                        <h2 className="text-white font-bold text-lg tracking-wide">Fare Breakup</h2>
                    </div>

                    <div className="p-5 space-y-3 text-sm">
                        <div className="flex justify-between items-start">
                            <div className="text-gray-500">
                                Total Tour Cost
                                <span className="block text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider">
                                    Final price per adult
                                </span>
                            </div>
                            <span className="font-semibold text-[#1A2332]">
                                ₹{totalTourCost.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Discount</span>
                            <span className="font-semibold text-green-600">– ₹0</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">GST @ 5%</span>
                            <span className="font-semibold text-[#1A2332]">
                                ₹{gstAmount.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                            <span className="font-bold text-[#1A2332]">Grand Total</span>
                            <span className="font-bold text-lg text-[#FF5722]">
                                ₹{grandTotal.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rewards Badge */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4">
                    <div className="text-xs font-bold text-amber-800 mb-1 uppercase tracking-wide">Your Rewards</div>
                    <div className="text-xs text-amber-700 mb-2">Here's what you'll earn for this booking</div>
                    <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-2">
                        <span className="font-extrabold text-[#1A2332] text-sm">EDGE</span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                            Earn 931 Loyalty Points <Info size={11} className="text-amber-500" />
                        </span>
                    </div>
                    <p className="text-[10px] text-amber-600 mt-2 leading-snug">
                        Points credited within 60 days of checkout
                    </p>
                </div>

                {/* CTA */}
                <button
                    onClick={onContinue}
                    className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
                >
                    Continue →
                </button>

                <div className="flex flex-wrap gap-3 text-xs text-[#1A2332]/60 justify-center">
                    <button className="hover:text-[#FF5722] transition-colors">▸ Cancellation Policy</button>
                    <button className="hover:text-[#FF5722] transition-colors">▸ Payment Terms</button>
                    <button className="hover:text-[#FF5722] transition-colors">▸ Tax Disclaimer</button>
                </div>
            </div>
        </div>
    );
}
