'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from '@/components/shared/AddToCartButton';
import PackageEnquiryModal from '@/components/tours/PackageEnquiryModal';
import EMIPlansModal from '@/components/tours/EMIPlansModal';
import PayUWidget from '@/components/tours/PayUWidget';
import { Phone, CreditCard, CheckCircle, Percent, Utensils, Hotel, Car, Camera } from 'lucide-react';
import { paymentsService } from '@/services/payments.service';

interface TourPricingCardProps {
    tour: any;
    originalPrice: number;
    isEnquiryModalOpen?: boolean;
    setIsEnquiryModalOpen?: (open: boolean) => void;
}

export default function TourPricingCard({
    tour,
    originalPrice,
    isEnquiryModalOpen: externalIsOpen,
    setIsEnquiryModalOpen: externalSetIsOpen
}: TourPricingCardProps) {
    const [internalIsOpen, internalSetIsOpen] = useState(false);

    // Use external state if provided, otherwise fallback to internal
    const isEnquiryModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsEnquiryModalOpen = externalSetIsOpen !== undefined ? externalSetIsOpen : internalSetIsOpen;

    const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
    const [emiInfo, setEmiInfo] = useState<any>(null);

    useEffect(() => {
        const fetchEmi = async () => {
            try {
                const data = await paymentsService.getEmiOptions(tour.price);
                setEmiInfo(data);
            } catch (error) {
                console.error('Failed to fetch EMI options:', error);
            }
        };
        fetchEmi();
    }, [tour.price]);

    return (
        <div className="bg-white rounded-none border border-gray-300 p-4 relative shadow-sm md:sticky md:top-24">

            <div className="mb-4">
                <p className="text-gray-500 text-sm font-handwriting mb-1">Starting From</p>

                <div className="flex flex-col">
                    <span className="text-gray-400 line-through text-md decoration-red-400 decoration-2">
                        ₹{originalPrice.toLocaleString()}/-
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-deepBlue whitespace-nowrap">
                            ₹{tour.price.toLocaleString()}/-
                        </span>
                        <span className="text-sm text-gray-600 font-medium">Per Person</span>
                    </div>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                    <Percent className="w-3.5 h-3.5 mt-0.5 text-saffron" />
                    <div className="flex-1">
                        <span className="font-bold text-saffron">No Cost EMI</span> Starts From ₹{emiInfo?.lowestEmi.toLocaleString('en-IN') || '---'}
                    </div>
                </div>
            </div>

            <EMIPlansModal
                isOpen={isEmiModalOpen}
                onClose={() => setIsEmiModalOpen(false)}
                tourName={tour.title}
                totalAmount={tour.price}
                emiInfo={emiInfo}
            />

            {/* PayU Widget Integration */}
            <div className="mb-6">
                <PayUWidget onViewPlans={() => setIsEmiModalOpen(true)} />
            </div>

            <div className="space-y-3 mb-6">
                <button
                    onClick={() => {
                        const element = document.getElementById('calculate-price-section');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            element.classList.add('ring-4', 'ring-saffron', 'ring-offset-2', 'transition-all', 'duration-500');
                            setTimeout(() => {
                                element.classList.remove('ring-4', 'ring-saffron', 'ring-offset-2');
                            }, 2000);
                        }
                    }}
                    className="w-full py-3 bg-white border-2 border-deepBlue text-deepBlue font-bold rounded hover:bg-deepBlue hover:text-white transition-all uppercase tracking-wider"
                >
                    BOOK NOW
                </button>

                <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded hover:border-deepBlue hover:text-deepBlue transition-all uppercase tracking-wider"
                >
                    Enquire Now
                </button>

                <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="w-full py-3 bg-saffron text-white font-bold rounded hover:bg-saffron-dark transition-all uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Plan Your Own Trip
                </button>
            </div>

            <PackageEnquiryModal
                isOpen={isEnquiryModalOpen}
                onClose={() => setIsEnquiryModalOpen(false)}
                tourName={tour.title}
                tourId={tour._id}
            />

            <div className="pt-4 border-t-2 border-dashed border-gray-200">
                <h4 className="font-handwriting text-gray-500 text-sm mb-3 text-center">- Package Includes -</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700">
                    {[
                        { name: 'Hotel', icon: <Hotel className="w-3.5 h-3.5 text-purple-500" />, bg: 'bg-purple-50' },
                        { name: 'Sightseeing', icon: <Camera className="w-3.5 h-3.5 text-blue-500" />, bg: 'bg-blue-50' },
                        { name: 'Transfer', icon: <Car className="w-3.5 h-3.5 text-green-500" />, bg: 'bg-green-50' },
                        { name: 'Meal', icon: <Utensils className="w-3.5 h-3.5 text-orange-500" />, bg: 'bg-orange-50' }
                    ].map((item) => (
                        <div key={item.name} className="flex items-center gap-2 border border-gray-100 rounded-lg px-2 py-1.5 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className={`${item.bg} p-1 rounded-full`}>
                                {item.icon}
                            </div>
                            <span className="font-bold text-gray-600">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
