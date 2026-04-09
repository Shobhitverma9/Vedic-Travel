'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, Utensils, Shield } from 'lucide-react';
import { authService } from '@/services/auth.service';

export interface Traveler {
    title: string;
    firstName: string;
    lastName: string;
    age: number | string;
    mealPreference: string;
    isPayer: boolean;
}

export interface Address {
    title: string;
    firstName: string;
    lastName: string;
    addressLine: string;
    state: string;
    city: string;
    pincode: string;
    email: string;
    mobile: string;
    gst?: string;
}

interface TravellerStepProps {
    adults: number;
    initialEmail?: string;
    onContinue: (travelers: Traveler[], address: Address) => void;
}

const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 outline-none text-sm text-[#1A2332] bg-white transition-all';
const selectClass = inputClass + ' bg-white cursor-pointer';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal',
];

export default function TravellerStep({ adults, initialEmail = '', onContinue }: TravellerStepProps) {
    const [travelers, setTravelers] = useState<Traveler[]>(
        Array(adults).fill(null).map(() => ({
            title: '',
            firstName: '',
            lastName: '',
            age: '',
            mealPreference: '',
            isPayer: false
        }))
    );

    const [address, setAddress] = useState<Address>({
        title: '',
        firstName: '',
        lastName: '',
        addressLine: '',
        state: '',
        city: '',
        pincode: '',
        email: initialEmail,
        mobile: '',
        gst: ''
    });

    const [payerIndex, setPayerIndex] = useState<number>(-1);
    const [savedTravellers, setSavedTravellers] = useState<any[]>([]);
    const [gstEnabled, setGstEnabled] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user && user.travellers) {
                    setSavedTravellers(user.travellers);
                }
            } catch {
                // Not logged in
            }
        };
        fetchUser();
    }, []);

    const handleTravelerChange = (index: number, field: keyof Traveler, value: any) => {
        const newTravelers = [...travelers];
        newTravelers[index] = { ...newTravelers[index], [field]: value };

        if (field === 'isPayer') {
            if (value === true) {
                newTravelers.forEach((t, i) => { if (i !== index) t.isPayer = false; });
                setPayerIndex(index);
                setAddress(prev => ({
                    ...prev,
                    title: newTravelers[index].title,
                    firstName: newTravelers[index].firstName,
                    lastName: newTravelers[index].lastName
                }));
            } else {
                setPayerIndex(-1);
            }
        }
        setTravelers(newTravelers);
    };

    const handleSelectSavedTraveller = (index: number, savedTravellerIndex: number) => {
        if (savedTravellerIndex === -1) return;
        const saved = savedTravellers[savedTravellerIndex];
        const newTravelers = [...travelers];
        newTravelers[index] = {
            ...newTravelers[index],
            title: saved.title || '',
            firstName: saved.firstName || '',
            lastName: saved.lastName || '',
            age: saved.dateOfBirth 
                ? Math.floor((Date.now() - new Date(saved.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                : '',
            mealPreference: saved.mealPreference || '',
        };
        setTravelers(newTravelers);
    };

    const handleAddressChange = (field: keyof Address, value: string) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onContinue(travelers, address);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form — 2/3 width */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} id="traveller-form">
                    {/* Travellers */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-5">
                        <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-4 flex items-center gap-3">
                            <User size={18} className="text-[#FF5722]" />
                            <div>
                                <h2 className="text-white font-bold text-base">Traveller Details</h2>
                                <p className="text-white/50 text-xs mt-0.5">Enter name exactly as on passport/ID</p>
                            </div>
                        </div>

                        <div className="p-5 space-y-6">
                            {travelers.map((traveler, index) => (
                                <div key={index} className={index < travelers.length - 1 ? 'border-b border-gray-100 pb-6' : ''}>
                                    {/* Traveller header */}
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold flex items-center justify-center">
                                                {index + 1}
                                            </span>
                                            <h3 className="font-semibold text-[#1A2332] text-sm">Adult {index + 1}</h3>
                                        </div>
                                        {savedTravellers.length > 0 && (
                                            <select
                                                onChange={(e) => handleSelectSavedTraveller(index, parseInt(e.target.value))}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-[#1A2332] focus:outline-none focus:border-[#FF5722] cursor-pointer"
                                                defaultValue="-1"
                                            >
                                                <option value="-1">Select saved traveller</option>
                                                {savedTravellers.map((st, i) => (
                                                    <option key={i} value={i}>{st.firstName} {st.lastName}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Fields grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Title</label>
                                            <select
                                                required
                                                value={traveler.title}
                                                onChange={(e) => handleTravelerChange(index, 'title', e.target.value)}
                                                className={selectClass}
                                            >
                                                <option value="">Title</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Ms">Ms</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="First Name"
                                                value={traveler.firstName}
                                                onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Last Name"
                                                value={traveler.lastName}
                                                onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide flex items-center gap-1">
                                                <Calendar size={10} /> Age
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                max="120"
                                                placeholder="Age"
                                                value={traveler.age}
                                                onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 items-center">
                                        <div>
                                            <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide flex items-center gap-1">
                                                <Utensils size={10} /> Meal Preference
                                            </label>
                                            <select
                                                value={traveler.mealPreference}
                                                onChange={(e) => handleTravelerChange(index, 'mealPreference', e.target.value)}
                                                className={selectClass}
                                            >
                                                <option value="">Select preference</option>
                                                <option value="Veg">🥦 Vegetarian</option>
                                                <option value="Jain">🌿 Jain - Subject to Availability</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 mt-4">
                                            <input
                                                type="checkbox"
                                                id={`payer-${index}`}
                                                checked={traveler.isPayer}
                                                onChange={(e) => handleTravelerChange(index, 'isPayer', e.target.checked)}
                                                className="w-4 h-4 accent-[#FF5722] rounded"
                                            />
                                            <label htmlFor={`payer-${index}`} className="text-xs text-gray-500 cursor-pointer select-none">
                                                Mark as billing contact
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-4 flex items-center gap-3">
                            <Shield size={18} className="text-[#FF5722]" />
                            <div>
                                <h2 className="text-white font-bold text-base">Address for Communication</h2>
                                <p className="text-white/50 text-xs mt-0.5">All fields are mandatory</p>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Title</label>
                                    <select required value={address.title} onChange={(e) => handleAddressChange('title', e.target.value)} className={selectClass}>
                                        <option value="">Title</option>
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Ms">Ms</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">First Name</label>
                                    <input type="text" required placeholder="First Name" value={address.firstName} onChange={(e) => handleAddressChange('firstName', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Last Name</label>
                                    <input type="text" required placeholder="Last Name" value={address.lastName} onChange={(e) => handleAddressChange('lastName', e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Address</label>
                                <input type="text" required placeholder="House no., Street, Area" value={address.addressLine} onChange={(e) => handleAddressChange('addressLine', e.target.value)} className={inputClass} />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">State</label>
                                    <select required value={address.state} onChange={(e) => handleAddressChange('state', e.target.value)} className={selectClass}>
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">City</label>
                                    <input type="text" required placeholder="City" value={address.city} onChange={(e) => handleAddressChange('city', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Pincode</label>
                                    <input type="text" required placeholder="6-digit pincode" value={address.pincode} onChange={(e) => handleAddressChange('pincode', e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Email</label>
                                    <input type="email" required placeholder="your@email.com" value={address.email} onChange={(e) => handleAddressChange('email', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-400 mb-1 uppercase tracking-wide">Mobile No.</label>
                                    <input type="tel" required placeholder="+91 XXXXX XXXXX" value={address.mobile} onChange={(e) => handleAddressChange('mobile', e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            {/* GST Toggle */}
                            <div className="border border-dashed border-gray-200 rounded-xl p-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={gstEnabled}
                                        onChange={(e) => {
                                            setGstEnabled(e.target.checked);
                                            if (!e.target.checked) handleAddressChange('gst', '');
                                        }}
                                        className="w-4 h-4 accent-[#FF5722] rounded"
                                    />
                                    <span className="text-sm text-gray-600 font-medium">Use GSTIN for this booking <span className="text-gray-400 font-normal">(Optional)</span></span>
                                </label>
                                {gstEnabled && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            placeholder="Enter GST Number"
                                            value={address.gst === 'YES' ? '' : address.gst || ''}
                                            onChange={(e) => handleAddressChange('gst', e.target.value)}
                                            className={inputClass}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                    <div className="bg-gradient-to-br from-[#1A2332] to-[#2C3E50] rounded-2xl p-5 text-white">
                        <h3 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wide">Why we need this</h3>
                        <ul className="space-y-2 text-xs text-white/60">
                            <li className="flex items-start gap-2">
                                <span className="text-[#FF5722] mt-0.5">●</span>
                                Your name must match your government-issued ID / passport
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#FF5722] mt-0.5">●</span>
                                Booking vouchers will be sent to your email
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#FF5722] mt-0.5">●</span>
                                We'll use your mobile for trip updates & emergency contact
                            </li>
                        </ul>
                    </div>

                    <button
                        type="submit"
                        form="traveller-form"
                        className="w-full bg-[#FF5722] hover:bg-[#E64A19] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide"
                    >
                        Continue to Payment →
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        🔒 Your data is encrypted and secure
                    </p>
                </div>
            </div>
        </div>
    );
}
