'use client';

import React from 'react';
import { Plus, Minus, Users, Trash2 } from 'lucide-react';

export interface Room {
    id: number;
    adults: number;
    childrenWithBed: number;
    infants: number;
}

interface RoomConfigurationProps {
    rooms: Room[];
    onChange: (rooms: Room[]) => void;
}

const RoomConfiguration: React.FC<RoomConfigurationProps> = ({ rooms, onChange }) => {

    const addRoom = () => {
        const newRoom: Room = {
            id: Date.now(),
            adults: 2,
            childrenWithBed: 0,
            infants: 0
        };
        onChange([...rooms, newRoom]);
    };

    const removeRoom = (index: number) => {
        // Prevent removing the last room
        if (rooms.length <= 1) return;
        const newRooms = rooms.filter((_, i) => i !== index);
        onChange(newRooms);
    };

    const updateRoom = (index: number, field: keyof Room, value: number) => {
        const newRooms = [...rooms];
        const room = { ...newRooms[index] };

        // Validation logic
        if (field === 'adults') {
            if (value < 1) return; // Min 1 adult per room
            // if (value > 4) return; // Max 4 adults usually - removed limit for flexibility
        } else {
            if (value < 0) return;
        }

        room[field] = value as number;
        newRooms[index] = room;
        onChange(newRooms);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-gray-700">Travellers</h3>
            </div>

            <div className="space-y-4">
                {rooms.map((room, index) => (
                    <div key={room.id} className="p-4 border border-gray-200 rounded-lg relative bg-white/50 hover:bg-white transition-colors group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h4 className="font-semibold text-deepBlue">Room {index + 1}</h4>
                            {rooms.length > 1 && (
                                <button
                                    onClick={() => removeRoom(index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Remove Room"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Adults */}
                            <div className="flex flex-col items-center">
                                <div className="min-h-[40px] flex flex-col items-center justify-end mb-2">
                                    <label className="text-xs text-gray-500 font-medium">Adult</label>
                                    <span className="text-[10px] text-gray-400">12+ yrs</span>
                                </div>
                                <div className="flex items-center justify-center border rounded-md bg-white">
                                    <button
                                        onClick={() => updateRoom(index, 'adults', room.adults - 1)}
                                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                        disabled={room.adults <= 1}
                                    ><Minus className="w-3 h-3" /></button>
                                    <span className="px-2 font-bold w-6 text-center text-sm">{room.adults}</span>
                                    <button
                                        onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                                        className="px-3 py-1 text-deepBlue hover:bg-blue-50 transition-colors"
                                    ><Plus className="w-3 h-3" /></button>
                                </div>
                            </div>

                            {/* Child below 12 years */}
                            <div className="flex flex-col items-center">
                                <div className="min-h-[40px] flex flex-col items-center justify-end mb-2">
                                    <label className="text-xs text-gray-500 font-medium text-center">Child</label>
                                    <span className="text-[10px] text-gray-400 text-center">Below 12 yrs</span>
                                </div>
                                <div className="flex items-center justify-center border rounded-md bg-white">
                                    <button
                                        onClick={() => updateRoom(index, 'childrenWithBed', room.childrenWithBed - 1)}
                                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                        disabled={room.childrenWithBed <= 0}
                                    ><Minus className="w-3 h-3" /></button>
                                    <span className="px-2 font-bold w-6 text-center text-sm">{room.childrenWithBed}</span>
                                    <button
                                        onClick={() => updateRoom(index, 'childrenWithBed', room.childrenWithBed + 1)}
                                        className="px-3 py-1 text-deepBlue hover:bg-blue-50 transition-colors"
                                    ><Plus className="w-3 h-3" /></button>
                                </div>
                            </div>

                            {/* Infants */}
                            <div className="flex flex-col items-center">
                                <div className="min-h-[40px] flex flex-col items-center justify-end mb-2">
                                    <label className="text-xs text-gray-500 font-medium">Infant</label>
                                    <span className="text-[10px] text-gray-400">0-2 yrs</span>
                                </div>
                                <div className="flex items-center justify-center border rounded-md bg-white">
                                    <button
                                        onClick={() => updateRoom(index, 'infants', room.infants - 1)}
                                        className="px-3 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                        disabled={room.infants <= 0}
                                    ><Minus className="w-3 h-3" /></button>
                                    <span className="px-2 font-bold w-6 text-center text-sm">{room.infants}</span>
                                    <button
                                        onClick={() => updateRoom(index, 'infants', room.infants + 1)}
                                        className="px-3 py-1 text-deepBlue hover:bg-blue-50 transition-colors"
                                    ><Plus className="w-3 h-3" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addRoom}
                className="flex items-center gap-2 text-saffron hover:text-orange-600 font-bold text-sm transition-colors mt-2"
            >
                <Plus className="w-4 h-4 bg-saffron text-white rounded-full p-0.5" />
                Add Room
            </button>
        </div>
    );
};

export default RoomConfiguration;
