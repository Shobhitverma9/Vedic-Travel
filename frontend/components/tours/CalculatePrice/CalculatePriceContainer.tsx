'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, Phone, Mail, ChevronDown, CheckCircle, Info } from 'lucide-react';
import { format } from 'date-fns';
import DepartureCitySelect from './DepartureCitySelect';
import RoomConfiguration, { Room } from './RoomConfiguration';
import BookingCalendar from './BookingCalendar';
import PriceBreakup from './PriceBreakup';
import Accordion from '../../ui/Accordion';
import BookingAuthModal from '@/components/checkout/BookingAuthModal';

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
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Contact Details
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [requestGroupDiscount, setRequestGroupDiscount] = useState(false);
    const [gstEnabled, setGstEnabled] = useState(false);
    const [gstNumber, setGstNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [gstError, setGstError] = useState('');

    // Pricing
    const [pricePerPerson, setPricePerPerson] = useState(tour.price);
    const [showPrice, setShowPrice] = useState(false);
    const [showBreakup, setShowBreakup] = useState(false);
    const [activePolicy, setActivePolicy] = useState<'payment' | 'cancellation' | 'terms' | 'privacy' | null>(null);
    const [paymentOption, setPaymentOption] = useState<'advance' | 'full' | 'custom'>('full');
    const [customAmount, setCustomAmount] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Derived states
    const totalTravelers = rooms.reduce((acc, room) => acc + room.adults + room.childrenWithBed, 0);

    // Initial load from localStorage
    useEffect(() => {
        const savedDraft = localStorage.getItem(`calc_price_draft_${tour._id}`);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                if (parsed.selectedCity) setSelectedCity(parsed.selectedCity);
                if (parsed.rooms) setRooms(parsed.rooms);
                if (parsed.travelDate) setTravelDate(new Date(parsed.travelDate));
                if (parsed.mobile) setMobile(parsed.mobile);
                if (parsed.email) setEmail(parsed.email);
                if (parsed.paymentOption) setPaymentOption(parsed.paymentOption);
                if (parsed.customAmount) setCustomAmount(parsed.customAmount);
                if (parsed.showPrice) setShowPrice(parsed.showPrice);
                if (parsed.acceptedTerms) setAcceptedTerms(parsed.acceptedTerms);
                if (parsed.pricePerPerson) setPricePerPerson(parsed.pricePerPerson);
                if (parsed.gstEnabled) setGstEnabled(parsed.gstEnabled);
                if (parsed.gstNumber) setGstNumber(parsed.gstNumber);
                if (parsed.companyName) setCompanyName(parsed.companyName);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
        setIsLoaded(true);
    }, [tour._id]);

    // Save to localStorage
    useEffect(() => {
        if (!isLoaded) return;
        const draft = {
            selectedCity,
            rooms,
            travelDate,
            mobile,
            email,
            paymentOption,
            customAmount,
            showPrice,
            acceptedTerms,
            pricePerPerson,
            gstEnabled,
            gstNumber,
            companyName
        };
        localStorage.setItem(`calc_price_draft_${tour._id}`, JSON.stringify(draft));
    }, [selectedCity, rooms, travelDate, mobile, email, paymentOption, customAmount, showPrice, acceptedTerms, pricePerPerson, gstEnabled, gstNumber, companyName, tour._id, isLoaded]);

    // Initial city setup (only if not loaded from draft)
    useEffect(() => {
        if (!isLoaded || selectedCity) return;
        const defaultCity = tour.departureCities?.find((c: any) => c.isDefault) ||
            tour.departureCities?.[0] ||
            { city: 'Joining Direct', surcharge: 0, availabilityType: 'daily' };
        setSelectedCity(defaultCity);
    }, [tour, isLoaded, selectedCity]);

    // Reset group discount if travelers <= 6
    useEffect(() => {
        if (totalTravelers <= 6) {
            setRequestGroupDiscount(false);
        }
    }, [totalTravelers]);

    const validateGST = (gst: string) => {
        const pattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gst) return true; // Optional
        return pattern.test(gst);
    };

    const handleCalculatePrice = () => {
        if (!selectedCity || !travelDate || !mobile || !email || !acceptedTerms) {
            alert('Please fill in all details to calculate price.');
            return;
        }
        
        if (gstEnabled) {
            if (!companyName) {
                alert('Please enter company name for GST booking.');
                return;
            }
            if (!gstNumber) {
                alert('Please enter GST number.');
                return;
            }
            if (!validateGST(gstNumber)) {
                alert('Please enter a valid GST number.');
                return;
            }
        }
        
        setShowPrice(true);
    };

    const handleContinueClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthModalOpen(true);
        } else {
            // Already logged in, proceed directly to checkout
            const corporateParams = gstEnabled ? `&gstEnabled=true&gstNumber=${gstNumber}&companyName=${encodeURIComponent(companyName)}` : '';
            window.location.href = `/checkout?tourId=${tour._id}${travelDate ? `&date=${travelDate.toISOString()}` : ''}&adults=${totalTravelers}${requestGroupDiscount ? '&groupDiscount=true' : ''}&departureCity=${selectedCity?.city || 'Joining Direct'}&citySurcharge=${selectedCity?.surcharge || 0}&paidAmount=${amountToPay}${corporateParams}`;
        }
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

    // Selected payment amount
    const advanceAmount = tour.advancePayment?.amount || 5000;
    const amountToPay = paymentOption === 'advance' 
        ? advanceAmount 
        : paymentOption === 'custom' 
            ? parseFloat(customAmount) || 0 
            : totalCost;

    // Policy content parsing logic
    const parseSections = (text: string | undefined, defaultTitle: string) => {
        if (!text) return [];
        const lines = text.split(/\r?\n/);
        const sections: { title: string; content: string[] }[] = [];
        let currentSection: { title: string; content: string[] } | null = null;

        const isHeader = (line: string) => {
            const trimmed = line.trim();
            if (!trimmed) return false;
            return (
                (trimmed.startsWith('**') && trimmed.endsWith('**')) ||
                (trimmed.startsWith('<b>') && trimmed.endsWith('</b>')) ||
                (trimmed.endsWith(':') && trimmed.length < 60) ||
                (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !/^\d+$/.test(trimmed)) ||
                (/^\d+\.\s/.test(trimmed) && trimmed.length < 60)
            );
        };

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (isHeader(trimmed)) {
                const title = trimmed.replace(/\*\*/g, '').replace(/<\/?b>/g, '').replace(/:$/, '');
                currentSection = { title, content: [] };
                sections.push(currentSection);
            } else {
                if (!currentSection) {
                    currentSection = { title: defaultTitle, content: [] };
                    sections.push(currentSection);
                }
                currentSection.content.push(line);
            }
        });
        return sections.length > 0 ? sections : [{ title: defaultTitle, content: [text] }];
    };

    const togglePolicy = (policy: 'payment' | 'cancellation' | 'terms' | 'privacy') => {
        setActivePolicy(activePolicy === policy ? null : policy);
    };

    const renderPolicyContent = () => {
        if (!activePolicy) return null;

        let text = '';
        let defaultTitle = '';
        let isExternal = false;

        switch (activePolicy) {
            case 'payment':
                text = tour.paymentTerms || 'Payment details coming soon...';
                defaultTitle = 'PAYMENTS';
                break;
            case 'cancellation':
                let cancellationText = '';
                if (tour.useDefaultCancellationPolicy !== false) {
                    cancellationText = '**Standard Cancellation Policy**\n' +
                                     '• Between 90 – 150 days before departure: Full refund (minus USD 300 deposit).\n' +
                                     '• Between 30-90 days before departure: 75% refund (minus USD 300 deposit).\n' +
                                     '• Less than 30 days prior: Non-Refundable.';
                } else {
                    cancellationText = tour.cancellationPolicy || 'Cancellation policy details coming soon...';
                }

                if (tour.hasEasyCancellation) {
                    cancellationText += '\n\n**Easy Cancellation**\n' +
                                      '• Cancellation before 45 days from travel date - NO Cancellation Charges.\n' +
                                      '• Cancelled between 45-30 days - 25% Cancellation charges\n' +
                                      '• Cancelled between 30-15 days - 50% Cancellation charges\n' +
                                      '• Cancelled within 15 days - Non-Refundable';
                }
                text = cancellationText;
                defaultTitle = 'CANCELLATION POLICY';
                break;
            case 'terms':
                let termsText = tour.termsAndConditions || 'Terms & Conditions coming soon...';
                
                if (tour.hasEasyVisa) {
                    termsText += '\n\n**Visa Easy**\nJust mention the reference code & drop the passport to the nearest VFS Center. You do not require to do the biometrics again or submit any financial documents.';
                }
                
                if (tour.hasHighSeason) {
                    termsText += '\n\n**High Season**\nPrices can fluctuate during peak season dates.';
                }

                if (tour.hasTravelValidity) {
                    termsText += '\n\n**Travel Validity**\nThe deal is valid for travel till Wednesday, 31 December 2025.';
                }
                
                if (tour.customBlocks && tour.customBlocks.length > 0) {
                    termsText += '\n\n' + tour.customBlocks.map((block: any) => `**${block.title}**\n${block.content}`).join('\n\n');
                }
                
                text = termsText;
                defaultTitle = 'TERMS & CONDITIONS';
                break;
            case 'privacy':
                isExternal = true;
                break;
        }

        if (isExternal) {
            return (
                <div className="p-4 bg-white border-t text-center">
                    <p className="text-sm text-gray-600 mb-2">Our detailed privacy policy is available on a separate page.</p>
                    <Link href="/privacy-policy" className="text-deepBlue font-bold hover:underline">View Privacy Policy</Link>
                </div>
            );
        }

        const sections = parseSections(text, defaultTitle);

        return (
            <div className="p-4 md:p-6 bg-white border-t animate-in fade-in slide-in-from-top-2 duration-300">
                {sections.map((section, idx) => (
                    <Accordion key={idx} title={section.title} defaultOpen={true}>
                        <div 
                            className="whitespace-pre-wrap text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: section.content.join('\n') }}
                        />
                    </Accordion>
                ))}
            </div>
        );
    };

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
                            {/* GST Toggle and Fields */}
                            <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
                                    <input
                                        type="checkbox"
                                        checked={gstEnabled}
                                        onChange={(e) => {
                                            setGstEnabled(e.target.checked);
                                            if (!e.target.checked) {
                                                setGstNumber('');
                                                setCompanyName('');
                                                setGstError('');
                                            }
                                        }}
                                        className="w-4 h-4 accent-deepBlue rounded"
                                    />
                                    <span className="text-sm text-deepBlue font-bold">I have a GST number <span className="text-gray-400 font-normal">(For corporate booking)</span></span>
                                </label>
                                
                                {gstEnabled && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <input
                                            type="text"
                                            placeholder="Company Name"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deepBlue/20 focus:border-deepBlue transition-all"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="GST Number"
                                                className={`w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                                                    gstNumber && !validateGST(gstNumber) 
                                                        ? 'border-red-400 focus:ring-red-100' 
                                                        : 'border-gray-300 focus:ring-deepBlue/20 focus:border-deepBlue'
                                                }`}
                                                value={gstNumber}
                                                onChange={(e) => {
                                                    const val = e.target.value.toUpperCase();
                                                    setGstNumber(val);
                                                    if (val && !validateGST(val)) {
                                                        setGstError('Invalid GST format');
                                                    } else {
                                                        setGstError('');
                                                    }
                                                }}
                                            />
                                            {gstError && (
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-medium">
                                                    {gstError}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                <label className="cursor-pointer group relative">
                                    <input 
                                        type="radio" 
                                        name="paymentOption" 
                                        className="peer sr-only" 
                                        checked={paymentOption === 'advance'}
                                        onChange={() => setPaymentOption('advance')}
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all h-full text-center ${
                                        paymentOption === 'advance' ? 'border-saffron bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="flex justify-center mb-2">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                paymentOption === 'advance' ? 'border-saffron bg-saffron' : 'border-gray-400'
                                            }`}>
                                                <CheckCircle className={`w-3 h-3 text-white transition-opacity ${
                                                    paymentOption === 'advance' ? 'opacity-100' : 'opacity-0'
                                                }`} />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Pay Advance &amp; Book your seats</h4>
                                        <p className="text-xl font-bold text-deepBlue whitespace-nowrap">₹ {advanceAmount.toLocaleString()}</p>
                                    </div>
                                </label>

                                {/* Option 2: Full Payment */}
                                <label className="cursor-pointer group relative">
                                    <input 
                                        type="radio" 
                                        name="paymentOption" 
                                        className="peer sr-only" 
                                        checked={paymentOption === 'full'}
                                        onChange={() => setPaymentOption('full')}
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all h-full text-center ${
                                        paymentOption === 'full' ? 'border-saffron bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="flex justify-center mb-2">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                paymentOption === 'full' ? 'border-saffron bg-saffron' : 'border-gray-400'
                                            }`}>
                                                <CheckCircle className={`w-3 h-3 text-white transition-opacity ${
                                                    paymentOption === 'full' ? 'opacity-100' : 'opacity-0'
                                                }`} />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Pay Full Amount</h4>
                                        <p className="text-xl font-bold text-deepBlue whitespace-nowrap">₹ {totalCost.toLocaleString()}</p>
                                    </div>
                                </label>

                                {/* Option 3: Custom Amount */}
                                <label className="cursor-pointer group relative">
                                    <input 
                                        type="radio" 
                                        name="paymentOption" 
                                        className="peer sr-only" 
                                        checked={paymentOption === 'custom'}
                                        onChange={() => setPaymentOption('custom')}
                                    />
                                    <div className={`p-4 rounded-xl border-2 transition-all h-full text-center ${
                                        paymentOption === 'custom' ? 'border-saffron bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <div className="flex justify-center mb-2">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                paymentOption === 'custom' ? 'border-saffron bg-saffron' : 'border-gray-400'
                                            }`}>
                                                <CheckCircle className={`w-3 h-3 text-white transition-opacity ${
                                                    paymentOption === 'custom' ? 'opacity-100' : 'opacity-0'
                                                }`} />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Enter the amount you wish to pay</h4>
                                        <input
                                            type="number"
                                            className="w-full border-b border-gray-300 bg-transparent text-center font-bold text-xl py-1 focus:outline-none focus:border-deepBlue"
                                            placeholder="Enter Amount"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setPaymentOption('custom');
                                            }}
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <div className="flex items-center justify-end mt-8 pt-6 border-t border-dashed border-gray-200">
                            <button
                                onClick={handleContinueClick}
                                className="bg-deepBlue text-white px-10 py-3 rounded-lg font-bold text-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                            >
                                Continue
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* Policy Tabs & Content */}
            <div className="border-t border-gray-100">
                <div className="flex border-b border-gray-50 bg-gray-50/30 overflow-x-auto no-scrollbar scroll-smooth">
                    <button 
                        onClick={() => togglePolicy('payment')}
                        className={`flex-1 min-w-[120px] py-4 px-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all relative ${
                            activePolicy === 'payment' 
                                ? 'text-blue-600 bg-white' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                        }`}
                    >
                        Payment terms
                        {activePolicy === 'payment' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                    <button 
                        onClick={() => togglePolicy('cancellation')}
                        className={`flex-1 min-w-[120px] py-4 px-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all relative ${
                            activePolicy === 'cancellation' 
                                ? 'text-blue-600 bg-white' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                        }`}
                    >
                        Cancellation Policy
                        {activePolicy === 'cancellation' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                    <button 
                        onClick={() => togglePolicy('terms')}
                        className={`flex-1 min-w-[140px] py-4 px-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all relative ${
                            activePolicy === 'terms' 
                                ? 'text-blue-600 bg-white' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                        }`}
                    >
                        Terms & Conditions
                        {activePolicy === 'terms' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                    <button 
                        onClick={() => togglePolicy('privacy')}
                        className={`flex-1 min-w-[120px] py-4 px-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all relative ${
                            activePolicy === 'privacy' 
                                ? 'text-blue-600 bg-white' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                        }`}
                    >
                        Privacy Policy
                        {activePolicy === 'privacy' && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                </div>
                {renderPolicyContent()}
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

            {/* Auth Modal */}
            <BookingAuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                returnUrl={`/checkout?tourId=${tour._id}${travelDate ? `&date=${travelDate.toISOString()}` : ''}&adults=${totalTravelers}${requestGroupDiscount ? '&groupDiscount=true' : ''}&departureCity=${selectedCity?.city || 'Joining Direct'}&citySurcharge=${selectedCity?.surcharge || 0}&paidAmount=${amountToPay}`}
            />
        </div>
    );
};

export default CalculatePriceContainer;
