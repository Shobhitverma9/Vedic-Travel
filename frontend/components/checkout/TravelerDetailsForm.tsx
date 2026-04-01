'use client';

import { User, Calendar, CreditCard } from 'lucide-react';

interface TravelerDetailsFormProps {
    travelers: any[];
    onChange: (index: number, field: string, value: any) => void;
}

export default function TravelerDetailsForm({ travelers, onChange }: TravelerDetailsFormProps) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Traveler Details</h2>
            <p className="text-gray-600 mb-6">
                Please provide details for all {travelers.length} travelers
            </p>

            <div className="space-y-6">
                {travelers.map((traveler, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-900 mb-4">
                            Traveler {index + 1}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <User size={16} className="inline mr-1" />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={traveler.name}
                                    onChange={(e) => onChange(index, 'name', e.target.value)}
                                    placeholder="Enter full name"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-1" />
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    value={traveler.age}
                                    onChange={(e) => onChange(index, 'age', parseInt(e.target.value))}
                                    placeholder="Age"
                                    min="1"
                                    max="120"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <select
                                    value={traveler.gender}
                                    onChange={(e) => onChange(index, 'gender', e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <CreditCard size={16} className="inline mr-1" />
                                    ID Proof Number *
                                </label>
                                <input
                                    type="text"
                                    value={traveler.idProof}
                                    onChange={(e) => onChange(index, 'idProof', e.target.value)}
                                    placeholder="Aadhar/PAN/Passport"
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#FF5722] focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
