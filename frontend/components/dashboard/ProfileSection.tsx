'use client';

import { useState } from 'react';
import { User as UserIcon, Mail, Phone, Calendar, Users, Heart, X } from 'lucide-react';
import { authService } from '@/services/auth.service';

interface ProfileSectionProps {
    user: any;
    onUpdate: (updatedUser: any) => void;
}

export default function ProfileSection({ user, onUpdate }: ProfileSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        maritalStatus: user?.maritalStatus || '',
    });
    const [loading, setLoading] = useState(false);

    // Verification Modals State
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [showPhoneDialog, setShowPhoneDialog] = useState(false);
    const [otp, setOtp] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await authService.updateProfile(formData);
            onUpdate(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailVerifyStart = () => {
        setOtp('');
        setShowEmailDialog(true);
        // Here you would trigger the backend to send an OTP to user.email
    };

    const handlePhoneVerifyStart = () => {
        if (!user?.phone) {
            alert('Please add a mobile number first by editing your profile.');
            return;
        }
        setOtp('');
        setShowPhoneDialog(true);
        // Here you would trigger the backend to send an OTP to user.phone
    };

    const submitEmailVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyLoading(true);
        try {
            // Placeholder: Call backend API to verify email OTP
            // await authService.verifyEmail(otp);
            alert('Email verified successfully! (Mocked validation for now)');
            onUpdate({ ...user, emailVerified: true });
            setShowEmailDialog(false);
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    const submitPhoneVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyLoading(true);
        try {
            // Placeholder: Call backend API to verify phone OTP
            // await authService.verifyPhone(otp);
            alert('Phone verified successfully! (Mocked validation for now)');
            onUpdate({ ...user, phoneVerified: true });
            setShowPhoneDialog(false);
        } catch (error) {
            alert('Invalid OTP. Please try again.');
        } finally {
            setVerifyLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Cancel
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                            >
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 relative">
            <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                    Edit Profile
                </button>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Name *</label>
                            <p className="text-gray-600 mt-1">{user?.name || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">E-mail *</label>
                                    <p className="text-gray-600 mt-1">{user?.email}</p>
                                </div>
                                {user?.emailVerified ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <div className="w-4 h-4 rounded-full border border-green-600 flex items-center justify-center text-[10px]">✓</div>
                                        Verified
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleEmailVerifyStart}
                                        className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-yellow-600 transition-colors"
                                    >
                                        Verify Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Mobile *</label>
                                    <p className="text-gray-600 mt-1">{user?.phone || 'Not provided'}</p>
                                </div>
                                {user?.phone && user?.phoneVerified ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <div className="w-4 h-4 rounded-full border border-green-600 flex items-center justify-center text-[10px]">✓</div>
                                        Verified
                                    </div>
                                ) : (
                                    <button
                                        onClick={handlePhoneVerifyStart}
                                        className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-yellow-600 transition-colors"
                                    >
                                        Verify Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Date of Birth *</label>
                            <p className="text-gray-600 mt-1">
                                {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not provided'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Gender *</label>
                            <p className="text-gray-600 mt-1">{user?.gender || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-orange-600">
                            <Heart className="w-5 h-5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Marital Status</label>
                            <p className="text-gray-600 mt-1">{user?.maritalStatus || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-6">
                    <h3 className="text-sm font-bold text-red-500 mb-2">PASSWORD</h3>
                    <p className="text-gray-600">********</p>
                    <button className="text-sm text-gray-500 mt-2 hover:text-gray-700 underline">Change Password</button>
                </div>
            </div>

            {/* Email Verification Dialog */}
            {showEmailDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Verify Email Address</h3>
                            <button onClick={() => setShowEmailDialog(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                We've sent a 6-digit verification code to <span className="font-semibold text-gray-900">{user?.email}</span>.
                            </p>
                            <form onSubmit={submitEmailVerify}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-center tracking-widest text-lg font-semibold"
                                        placeholder="------"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={verifyLoading || otp.length < 4}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {verifyLoading ? 'Verifying...' : 'Verify Email'}
                                </button>
                                <div className="mt-4 text-center">
                                    <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Verification Dialog */}
            {showPhoneDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Verify Mobile Number</h3>
                            <button onClick={() => setShowPhoneDialog(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600 mb-4">
                                We've sent an SMS with a verification code to <span className="font-semibold text-gray-900">{user?.phone}</span>.
                            </p>
                            <form onSubmit={submitPhoneVerify}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-center tracking-widest text-lg font-semibold"
                                        placeholder="------"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={verifyLoading || otp.length < 4}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {verifyLoading ? 'Verifying...' : 'Verify Mobile'}
                                </button>
                                <div className="mt-4 text-center">
                                    <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                                        Resend Code
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

