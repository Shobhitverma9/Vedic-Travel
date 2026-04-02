'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Phone, Mail, ChevronDown, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import DepartureCitySelect from './DepartureCitySelect';
import RoomConfiguration, { Room } from './RoomConfiguration';
import BookingCalendar from './BookingCalendar';
import PriceBreakup from './PriceBreakup';

interface CalculatePriceContainerProps {
    tour: any; // Type strictly later
}

const CalculatePriceContainer: React.FC<CalculatePriceContainerProps> = ({ tour }) => {
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [rooms, setRooms] = useState<Room[]>([
        { id: 1, adults: 2, childrenWithBed: 0, infants: 0 }
    ]);
    const [travelDate, setTravelDate] = useState<Date | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Contact Details
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [requestGroupDiscount, setRequestGroupDiscount] = useState(false);

    // Pricing
    const [pricePerPerson, setPricePerPerson] = useState(tour.price);
    const [showPrice, setShowPrice] = useState(false);
    const [showBreakup, setShowBreakup] = useState(false);

    // Derived states
    const totalTravelers = rooms.reduce((acc, room) => acc + room.adults + room.childrenWithBed, 0);

    // Initial city setup
    useEffect(() => {
        const defaultCity = tour.departureCities?.find((c: any) => c.isDefault) ||
            tour.departureCities?.[0] ||
            { city: 'Joining Direct', surcharge: 0, availabilityType: 'daily' };
        setSelectedCity(defaultCity);
    }, [tour]);

    // Reset group discount if travelers <= 6
    useEffect(() => {
        if (totalTravelers <= 6) {
            setRequestGroupDiscount(false);
        }
    }, [totalTravelers]);

    const handleCalculatePrice = () => {
        if (!selectedCity || !travelDate || !mobile || !email || !acceptedTerms) {
            alert('Please fill in all details to calculate price.');
            return;
        }
        setShowPrice(true);
    };

    const handleDateSelect = (date: Date, price: number) => {
        setTravelDate(date);
        setPricePerPerson(price);
        setIsCalendarOpen(false);
    };

    // Prepare cities list (ensure Joining Direct is there)
    const cities = tour.departureCities && tour.departureCities.length > 0
        ? tour.departureCities
        : [{ city: 'Joining Direct', surcharge: 0, availabilityType: 'daily' }];

    // Total Price Calculation
    // Logic: (Base Price + City Surcharge) * Travelers + GST
    const baseCost = pricePerPerson * totalTravelers;
    const gstRate = 0.05;
    const gstAmount = baseCost * gstRate;
    const totalCost = baseCost + gstAmount;

    return (
        <div id="calculate-price-section" className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8 scroll-mt-24">
            <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-blue-100">
                <h2 className="text-xl font-bold text-deepBlue">Calculate Price</h2>
                <p className="text-sm text-gray-500">Select your preferences to get the best price.</p>
            </div>

            <div className="p-6 space-y-8">

                {/* 1. Details Form */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Left Column: Configuration */}
                    <div className="space-y-6">
                        <DepartureCitySelect
                            cities={cities}
                            selectedCity={selectedCity}
                            onChange={setSelectedCity}
                        />

                        <RoomConfiguration
                            rooms={rooms}
                            onChange={setRooms}
                        />
                    </div>

                    {/* Right Column: Date & Contact */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                <h3 className="font-medium text-gray-700">Date of Travel</h3>
                            </div>
                            <button
                                onClick={() => setIsCalendarOpen(true)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-left text-gray-700 flex justify-between items-center hover:border-deepBlue transition-colors group"
                            >
                                <span className={travelDate ? 'font-medium text-deepBlue' : 'text-gray-400'}>
                                    {travelDate ? format(travelDate, 'dd MMMM yyyy') : 'Select Travel Date'}
                                </span>
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-deepBlue" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <h3 className="font-medium text-gray-700">Contact Details</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="tel"
                                    placeholder="Mobile"
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-deepBlue/20 focus:border-deepBlue"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-deepBlue/20 focus:border-deepBlue"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-gray-400 italic mt-1">
                                Your booking details will be sent to these contact details.
                            </p>
                        </div>

                        <div className="pt-2">
                            {totalTravelers > 6 && (
                                <div className="mb-4 p-3 bg-saffron/5 rounded-lg border border-saffron/20">
                                    <label className="flex items-start gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="mt-1 w-4 h-4 text-deepBlue border-gray-300 rounded focus:ring-deepBlue"
                                            checked={requestGroupDiscount}
                                            onChange={(e) => setRequestGroupDiscount(e.target.checked)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-deepBlue group-hover:text-saffron transition-colors">
                                                Request for Group Discount
                                            </span>
                                            <span className="text-[11px] text-gray-500 leading-tight">
                                                Applicable for more than 6 persons. Our team will contact you with special pricing.
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            )}

                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 text-deepBlue border-gray-300 rounded focus:ring-deepBlue"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <span className="text-sm text-gray-600">
                                    I accept the <a href="#" className="text-deepBlue font-medium hover:underline">Privacy Policy</a>, <a href="#" className="text-deepBlue font-medium hover:underline">Traveler Visa Declaration</a>, and <a href="#" className="text-deepBlue font-medium hover:underline">Terms & Conditions</a>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Calculate Button */}
                {!showPrice && (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={handleCalculatePrice}
                            disabled={!acceptedTerms || !travelDate || !mobile || !email}
                            className="bg-deepBlue text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            Calculate Package Price
                        </button>
                    </div>
                )}

                {/* 2. Price Expansion Section */}
                {showPrice && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-500 border-t border-dashed border-gray-300 pt-8 mt-4">
                        <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">

                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-display text-gray-600 mb-1">Total Price</h3>
                                <p className="text-sm text-gray-400">(Including GST)</p>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-deepBlue whitespace-nowrap">
                                    ₹ {totalCost.toLocaleString()}
                                </div>
                                <button
                                    onClick={() => setShowBreakup(!showBreakup)}
                                    className="flex items-center justify-center gap-1 text-deepBlue/80 hover:text-deepBlue font-medium text-sm mt-1"
                                >
                                    <Info className="w-4 h-4" />
                                    View Fare Breakup
                                </button>

                                {/* Fare Breakup Popover */}
                                <div className="relative">
                                    <PriceBreakup
                                        isOpen={showBreakup}
                                        onClose={() => setShowBreakup(false)}
                                        breakup={{
                                            basePrice: pricePerPerson,
                                            surcharge: selectedCity?.surcharge || 0,
                                            gst: gstAmount,
                                            total: totalCost,
                                            travelers: totalTravelers
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="mt-8 space-y-6">
                            <h3 className="text-center font-medium text-gray-700">Select Payment Amount</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Option 1: Advance */}
                                <label className="cursor-pointer group relative">
                                    <input type="radio" name="paymentOption" className="peer sr-only" />
                                    <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-saffron peer-checked:bg-orange-50/50 hover:border-gray-300 transition-all h-full text-center">
                                        <div className="flex justify-center mb-2">
                                            <div className="w-5 h-5 rounded border border-gray-400 peer-checked:border-saffron peer-checked:bg-saffron flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Pay Advance &amp; Book your seats</h4>
                                        <p className="text-xl font-bold text-deepBlue whitespace-nowrap">₹ {(tour.advancePayment?.amount || 5000).toLocaleString()}</p>
                                    </div>
                                </label>

                                {/* Option 2: Full Payment */}
                                <label className="cursor-pointer group relative">
                                    <input type="radio" name="paymentOption" className="peer sr-only" defaultChecked />
                                    <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-saffron peer-checked:bg-orange-50/50 hover:border-gray-300 transition-all h-full text-center">
                                        <div className="flex justify-center mb-2">
                                            <div className="w-5 h-5 rounded border border-gray-400 peer-checked:border-saffron peer-checked:bg-saffron flex items-center justify-center"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Pay Full Amount</h4>
                                        <p className="text-xl font-bold text-deepBlue whitespace-nowrap">₹ {totalCost.toLocaleString()}</p>
                                    </div>
                                </label>

                                {/* Option 3: Custom Amount */}
                                <label className="cursor-pointer group relative">
                                    <input type="radio" name="paymentOption" className="peer sr-only" />
                                    <div className="p-4 rounded-xl border-2 border-gray-200 peer-checked:border-saffron peer-checked:bg-orange-50/50 hover:border-gray-300 transition-all h-full text-center">
                                        <div className="flex justify-center mb-2">
                                            <div className="w-5 h-5 rounded border border-gray-400 peer-checked:border-saffron peer-checked:bg-saffron flex items-center justify-center"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Enter the amount you wish to pay</h4>
                                        <input
                                            type="number"
                                            className="w-full border-b border-gray-300 bg-transparent text-center font-bold text-xl py-1 focus:outline-none focus:border-deepBlue"
                                            placeholder="Enter Amount"
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div className="flex items-center justify-end mt-8 pt-6 border-t border-dashed border-gray-200">
                            <Link
                                href={`/checkout?tourId=${tour._id}${travelDate ? `&date=${travelDate.toISOString()}` : ''}&adults=${totalTravelers}${requestGroupDiscount ? '&groupDiscount=true' : ''}`}
                                className="bg-deepBlue text-white px-10 py-3 rounded-lg font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                            >
                                Continue
                            </Link>
                        </div>

                    </div>
                )}
            </div>

            {/* Footer Links */}
            <div className="bg-gray-50 px-6 py-3 border-t flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-deepBlue/80">
                <Link href="/terms-and-conditions#payment-terms" className="hover:underline">Payment terms</Link>
                <Link href="/cancellation-policy" className="hover:underline">Cancellation Policy</Link>
                <Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            </div>

            {/* Calendar Modal */}
            <BookingCalendar
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onSelectDate={handleDateSelect}
                selectedDate={travelDate}
                departureCity={selectedCity}
                basePrice={tour.price}
            />
        </div>
    );
};

export default CalculatePriceContainer;
