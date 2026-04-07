'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, CheckCircle } from 'lucide-react';
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
        // Only prevent past dates, as requested to make all dates choosable
        return !isBefore(date, startOfDay(new Date()));
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-4 md:p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-lg md:text-2xl font-bold text-deepBlue">Select Date of Travel</h2>
                        <p className="text-[10px] md:text-sm text-gray-500 line-clamp-1 md:line-clamp-none">Starting price per person shown in calendar.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                    </button>
                </div>

                {/* Calendar Controls */}
                <div className="flex items-center justify-between p-3 md:p-4 px-4 md:px-8 border-b">
                    <div className="flex items-center gap-2 md:gap-4">
                        <h3 className="text-base md:text-xl font-bold text-gray-800 w-32 md:w-40">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h3>
                        <div className="flex gap-1 md:gap-2">
                            <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                            </button>
                            <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-deepBlue"></span>
                            <span>Available</span>
                        </div>
                    </div>
                </div>

                {/* Grid Header */}
                <div className="grid grid-cols-7 border-b bg-gray-50/50">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                        <div key={d} className="py-2 md:py-3 text-center text-[10px] md:text-xs font-semibold text-gray-500 tracking-wider">
                            <span className="hidden md:inline">{d}</span>
                            <span className="md:hidden">{d.charAt(0)}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto p-2 md:p-4">
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {calendarDays.map((day: Date, idx: number) => {
                            // Adjust for Monday start if needed, but date-fns startOfWeek handles it
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const available = isDateAvailable(day);
                            const price = getPriceForDate(day);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);

                            if (!isCurrentMonth) return <div key={idx} className="h-20 md:h-28 bg-gray-50/30 rounded-lg"></div>;

                            return (
                                <button
                                    key={idx}
                                    disabled={!available}
                                    onClick={() => available && onSelectDate(day, price)}
                                    className={`
                                        h-20 md:h-28 rounded-lg md:rounded-xl border flex flex-col justify-between p-1 md:p-2 text-left transition-all
                                        ${isSelected
                                            ? 'border-deepBlue bg-blue-50 ring-1 md:ring-2 ring-deepBlue ring-offset-1 md:ring-offset-2'
                                            : available
                                                ? 'border-gray-200 hover:border-deepBlue hover:shadow-md cursor-pointer bg-white'
                                                : 'border-transparent bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-xs md:text-sm font-semibold ${isSelected ? 'text-deepBlue' : 'text-gray-700'}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-deepBlue animate-in zoom-in duration-300" />
                                        )}
                                    </div>

                                    {available && (
                                        <div className="mt-auto text-right">
                                            <div className="hidden md:block text-[10px] text-gray-500 line-through decoration-red-500">
                                                ₹ {Math.round(price * 1.2).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] md:text-sm font-bold text-deepBlue">
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
