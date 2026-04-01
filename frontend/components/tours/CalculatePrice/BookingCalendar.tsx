'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addDays, getDay, isBefore, startOfDay } from 'date-fns';

interface BookingCalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date, price: number) => void;
    selectedDate: Date | null;
    departureCity: any; // Using any for now, refine with proper type later
    basePrice: number;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
    isOpen,
    onClose,
    onSelectDate,
    selectedDate,
    departureCity,
    basePrice
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Derived state for calendar generation
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Generate calendar grid
    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    // Calculate price for a specific date
    // This logic mimics the backend logic roughly for visual feedback
    const getPriceForDate = (date: Date) => {
        let price = basePrice;

        // Add departure city surcharge
        if (departureCity?.surcharge) {
            price += departureCity.surcharge;
        }

        // TODO: Add more complex logic based on availability rules (weekend surcharges, specific date pricing)
        // For now, return a standard price or show "On Request" if not available
        return price;
    };

    const isDateAvailable = (date: Date) => {
        // Basic check: prevent past dates
        if (isBefore(date, startOfDay(new Date()))) return false;

        if (!departureCity) return true;

        if (departureCity.availabilityType === 'specific_dates') {
            // Check if date is in availableDates array
            return departureCity.availableDates?.some((d: any) => isSameDay(new Date(d), date));
        } else if (departureCity.availabilityType === 'monthly_dates') {
            // Check if day-of-month matches any of the configured monthly day numbers
            const dom = date.getDate();
            return departureCity.monthlyDays?.includes(dom) ?? false;
        } else if (departureCity.availabilityType === 'weekly') {
            // Check if day of week is allowed
            const dayOfWeek = getDay(date); // 0 = Sunday
            return departureCity.weeklyDays?.includes(dayOfWeek);
        } else if (departureCity.availabilityType === 'daily') {
            return true;
        }

        return true; // Default
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-deepBlue">Select Date of Travel</h2>
                        <p className="text-sm text-gray-500">The price in calendar represents the starting price per person.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Calendar Controls */}
                <div className="flex items-center justify-between p-4 px-8 border-b">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold text-gray-800 w-40">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronRight className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-deepBlue"></span>
                            <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-saffron"></span>
                            <span>On Request</span>
                        </div>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 border-b bg-gray-50/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                        <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day: Date, idx: number) => {
                            // Adjust for Monday start if needed, but date-fns startOfWeek handles it
                            // Note: date-fns default startOfWeek is Sunday without options. 
                            // We need to visually align if the grid header is Mon-Sun.
                            // However, let's stick to standard alignment for now.

                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const available = isDateAvailable(day);
                            const price = getPriceForDate(day);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);

                            if (!isCurrentMonth) return <div key={idx} className="h-24 bg-gray-50/30 rounded-lg"></div>;

                            return (
                                <button
                                    key={idx}
                                    disabled={!available}
                                    onClick={() => available && onSelectDate(day, price)}
                                    className={`
                                        h-28 rounded-xl border flex flex-col justify-between p-2 text-left transition-all
                                        ${isSelected
                                            ? 'border-deepBlue bg-blue-50 ring-2 ring-deepBlue ring-offset-2'
                                            : available
                                                ? 'border-gray-200 hover:border-deepBlue hover:shadow-md cursor-pointer bg-white'
                                                : 'border-transparent bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <span className={`font-semibold ${isSelected ? 'text-deepBlue' : 'text-gray-700'}`}>
                                        {format(day, 'd')}
                                    </span>

                                    {available && (
                                        <div className="mt-auto text-right">
                                            <div className="text-[10px] text-gray-500 line-through decoration-red-500">
                                                ₹ {Math.round(price * 1.2).toLocaleString()}
                                            </div>
                                            <div className="text-sm font-bold text-deepBlue">
                                                ₹ {price.toLocaleString()}
                                            </div>
                                            {/* Optional: Add "Available" tag or icon */}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookingCalendar;
