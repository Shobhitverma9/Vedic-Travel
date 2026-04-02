'use client';

import { useState } from 'react';
import { User, Plus, Trash2, Edit2 } from 'lucide-react';
import { authService } from '@/services/auth.service';

interface TravellersSectionProps {
    user: any;
    onUpdate: (updatedUser: any) => void;
}

export default function TravellersSection({ user, onUpdate }: TravellersSectionProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    // Initial state for form
    const initialFormState = {
        title: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        passportNumber: '',
        passportExpiry: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (traveller: any, index: number) => {
        setFormData({
            title: traveller.title || '',
            firstName: traveller.firstName || '',
            lastName: traveller.lastName || '',
            dateOfBirth: traveller.dateOfBirth ? new Date(traveller.dateOfBirth).toISOString().split('T')[0] : '',
            gender: traveller.gender || '',
            passportNumber: traveller.passportNumber || '',
            passportExpiry: traveller.passportExpiry ? new Date(traveller.passportExpiry).toISOString().split('T')[0] : ''
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingIndex(null);
        setFormData(initialFormState);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const currentTravellers = user.travellers || [];
            let newTravellers;

            if (editingIndex !== null) {
                // Update existing
                newTravellers = [...currentTravellers];
                newTravellers[editingIndex] = formData;
            } else {
                // Add new
                newTravellers = [...currentTravellers, formData];
            }

            const updatedUser = await authService.updateProfile({ travellers: newTravellers });
            onUpdate(updatedUser);
            handleCancel();
        } catch (error) {
            console.error('Failed to update travellers:', error);
            alert('Failed to save traveller. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (index: number) => {
        if (!confirm('Are you sure you want to remove this traveller?')) return;

        setLoading(true);
        try {
            const newTravellers = user.travellers.filter((_: any, i: number) => i !== index);
            const updatedUser = await authService.updateProfile({ travellers: newTravellers });
            onUpdate(updatedUser);
        } catch (error) {
            console.error('Failed to delete traveller:', error);
            alert('Failed to delete traveller. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Travellers</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Traveller
                    </button>
                )}
            </div>

            {isAdding ? (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">{editingIndex !== null ? 'Edit Traveller' : 'Add New Traveller'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <select
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="">Select</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                <select
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                <input
                                    type="text"
                                    name="passportNumber"
                                    value={formData.passportNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry</label>
                                <input
                                    type="date"
                                    name="passportExpiry"
                                    value={formData.passportExpiry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Traveller'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user?.travellers && user.travellers.length > 0 ? (
                        user.travellers.map((traveller: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white group relative">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(traveller, index)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{traveller.title} {traveller.firstName} {traveller.lastName}</h3>
                                        <p className="text-sm text-gray-500">{traveller.gender} • {traveller.dateOfBirth ? new Date(traveller.dateOfBirth).toLocaleDateString() : 'DOB not set'}</p>
                                    </div>
                                </div>

                                {traveller.passportNumber && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-100">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Passport Details</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-mono text-gray-800">{traveller.passportNumber}</span>
                                            {traveller.passportExpiry && (
                                                <span className="text-gray-500">Exp: {new Date(traveller.passportExpiry).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 px-4 text-center border border-dashed border-gray-200 rounded-[2rem] bg-gradient-to-b from-gray-50/50 to-white">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                                <User className="w-10 h-10 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No travellers added yet</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                                Save your family and friends' details once to make your future bookings faster and more convenient.
                            </p>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="inline-flex items-center px-8 py-3 rounded-xl shadow-lg shadow-orange-100 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Traveller
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
