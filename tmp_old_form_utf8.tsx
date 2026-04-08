'use client';

import React, { useState } from 'react';
import { Send, User, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { inquiriesService } from '@/services/inquiries.service';
import ReCaptcha from '../shared/ReCaptcha';
import { toast } from 'sonner';

interface CustomEnquiryFormProps {
    yatraId: string;
    yatraName: string;
}

export default function CustomEnquiryForm({ yatraId, yatraName }: CustomEnquiryFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        acceptedPrivacy: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.acceptedPrivacy) {
            toast.error('Please accept the Privacy Policy to proceed');
            return;
        }

        if (!recaptchaToken) {
            toast.error('Please complete the reCAPTCHA verification');
            return;
        }

        setLoading(true);

        try {
            await inquiriesService.createInquiry({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                yatraId,
                yatraName,
                tourName: `Custom: ${yatraName}`,
                tourId: 'custom',
                recaptchaToken,
                // Removed fields fallback
                adults: 1,
                children: 0,
                infants: 0,
                message: `Interested in a custom package for ${yatraName}`,
            });
            setSuccess(true);
            setRecaptchaToken(null);
            setFormData({
                name: '',
                email: '',
                mobile: '',
                acceptedPrivacy: false,
            });
        } catch (error) {
            console.error('Inquiry failed:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        "Rated Best Travel Partner",
        "Most Experienced Tour Managers",
        "Choose from 1000+ Holiday Packages"
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-100">
                    {/* Left Side: Thomas Cook inspired Info Section */}
                    <div className="lg:w-2/5 p-10 lg:p-16 bg-gradient-to-br from-[#003580] to-[#0052cc] text-white relative flex flex-col justify-center">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">
                                Get Exclusive Deals
                            </h2>
                            
                            <div className="space-y-4 mb-10">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-yellow-400 rounded-full p-0.5">
                                            <CheckCircle2 className="w-5 h-5 text-[#003580] fill-yellow-400 stroke-[#003580]" />
                                        </div>
                                        <span className="text-lg font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-blue-100/80 text-sm font-medium border-t border-white/20 pt-8">
                                VedicTravel is committed to providing spiritual and professional travel experiences across the globe.
   