'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface DepartureCity {
    city: string;
    surcharge: number;
    // other fields like availabilityType etc.
}

interface DepartureCitySelectProps {
    cities: DepartureCity[];
    selectedCity: DepartureCity | null;
    onChange: (city: DepartureCity) => void;
}

const DepartureCitySelect: React.FC<DepartureCitySelectProps> = ({ cities, selectedCity, onChange }) => {
    // Ensure "Joining Direct" is always an option if not in the list, or handled by parent
    // For now, assume parent passes full list including "Joining Direct"

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-gray-700">Departure City</h3>
            </div>

            <div className="relative">
                <select
                    className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-deepBlue focus:border-transparent bg-white text-gray-700 font-medium"
                    value={selectedCity?.city || ''}
                    onChange={(e) => {
                        const city = cities.find(c => c.city === e.target.value);
                        if (city && onChange) {
                            onChange(city);
                        }
                    }}
                >
                    <option value="" disabled>Select City</option>
                    {cities.map((city) => (
                        <option key={city.city} value={city.city}>
                            {city.city} {city.surcharge > 0 ? `(+₹${city.surcharge})` : ''}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default DepartureCitySelect;
