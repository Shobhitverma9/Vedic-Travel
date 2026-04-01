'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Mail, MessageSquare, Send, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import PopularPackagesSidebar from '@/components/contact/PopularPackagesSidebar';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { inquiriesService } from '@/services/inquiries.service';

export default function TermsAndConditionsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [expertMobile, setExpertMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [expertLoading, setExpertLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [expertStatus, setExpertStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await inquiriesService.createInquiry({
                ...formData,
                tourId: 'terms-and-conditions-page',
                tourName: 'Terms and Conditions Page Enquiry'
            });
            setStatus('success');
            setFormData({ name: '', email: '', mobile: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleExpertSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expertMobile) return;
        setExpertLoading(true);
        try {
            await inquiriesService.createInquiry({
                name: 'Guest User',
                email: 'expert-callback@vedictravel.com',
                mobile: expertMobile,
                message: 'Requesting callback from expert (Terms & Conditions Page)',
                tourId: 'expert-callback',
                tourName: 'Expert Callback'
            });
            setExpertStatus('success');
            setExpertMobile('');
        } catch (error) {
            console.error('Error submitting expert inquiry:', error);
            setExpertStatus('error');
        } finally {
            setExpertLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop"
                    alt="Terms and Conditions"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white text-center px-4">
                        Vedic Travel Terms and Conditions
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-3xl font-bold text-deepBlue mb-6 underline decoration-red-500 underline-offset-8">
                                Vedic Travel Terms and Conditions
                            </h2>

                            <div className="prose prose-lg max-w-none text-gray-700 space-y-8 leading-relaxed">
                                <p>
                                    While submitting the Booking Form, you agree to these conditions, which constitute an agreement between <strong>Vedic Travel</strong> and you. These conditions apply to the exclusion of any other terms or conditions unless they are set out in the Booking Form or are otherwise agreed to in writing by the parties. Previous dealings between the parties will not vary these conditions. No claimed variation of these conditions will be effective unless in writing and signed by a person so authorized by Vedic Travel.
                                </p>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">1. Booking & Advance Deposit</h3>
                                    <p>
                                        To reserve your seat for the tour/trip, please fill-in the Booking Form and send it with the <em>Non-Refundable Advance Deposit</em> of INR 15,000 per person for Indian nationality or USD 300 per person for nationality other than Indian, for Kailash Mansarovar Yatra and INR 10,000 | USD 300 or 20% of the Package Cost, whichever is higher for the other destinations.
                                    </p>
                                </section>

                                <section id="payment-terms" className="space-y-4 text-sm md:text-base scroll-mt-24">
                                    <h3 className="text-xl font-bold text-deepBlue">2. Payment</h3>
                                    <p>
                                        We must receive the <em>Full Payment</em> 30 days before your departure date of the trip. Without full payment, one cannot commence their trip. No Exception Accepted. If you are paying in Indian Currency (INR), note that the current valuation is 1 USD to 85.5 INR. If this exchange rate increases on the time of departure date, then you have to pay the difference amount.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">3. Amendments/Change of Departure Date</h3>
                                    <p>
                                        If you wish to amend your trip arrangements, you must notify Vedic Travel in writing. Each amendment to your trip arrangements must be made 60 days before the departure, otherwise an administration fee of USD 50 | INR 3250 per person will be applied. All administration fees must be paid before departure.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">4. Cancellation Policy</h3>
                                    <p>
                                        Your satisfaction and trust are our aim. However, we are not responsible for any cancellation due to any industrial disputes, technical failure of any type of transport we use, loss of earnings, late arrivals, force majeure, or any items beyond our control. Even if you wish to cancel your trip after booking, you must notify Vedic Travel in writing. Once we &apos;Vedic Travel&apos; receives your notice, cancellation will be effective subject to the following:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>If cancellation takes place between 90 – 150 days before your departure date, your full payment will be refunded, except the non-refundable deposit of USD 300 | INR 15000 for Kailash Mansarovar Yatra & USD 300 | INR 10000 or 20% of Package Cost, whichever is higher for other destinations.</li>
                                        <li>If cancellation takes place between 30-90 days before departure, 75% of your payment will be refunded, except the non-refundable deposit.</li>
                                        <li>If cancellation takes place less than 30 days before departure due to the client&apos;s personal problems, all previously paid amount(s) will be forfeited.</li>
                                        <li>The refund initiated shall take 15 working days to complete the process, counting from the day of mail and cancelled cheque received.</li>
                                        <li>Cancellation terms are subject to the specific conditions outlined in the selected or booked package and shall be governed accordingly.</li>
                                        <li>The booking amount is completely non-refundable, no matter the circumstances.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">5. Medical Disclosure</h3>
                                    <p>You declare and warrant that:</p>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>You are in good mental and physical fitness at the time of booking this trip.</li>
                                        <li>You have disclosed to Vedic Travel, of every matter concerning your health - mental and physical, of which you are aware, or ought to reasonably know, that is relevant to Vedic Travel&apos;s decision to permit you to go on the trip.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">6. Route Changes, Postponement, Cancellation, or Delay</h3>
                                    <p>Vedic Travel reserves the right to:</p>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>Change the date of departure or conclusion of the trip, or</li>
                                        <li>Modify any aspect of the trip, or</li>
                                        <li>Cancel or modify any routes within the trip or objectives set out in the itinerary, or</li>
                                        <li>Substitute different or equivalent routes within the trip in place of cancelled or modified routes, or</li>
                                        <li>Postpone, cancel or delay, any such aspect of the tour if, in the absolute discretion of Vedic Travel, it is necessary to do so due to inclement weather, snow or icy conditions or conditions that are otherwise likely to be hazardous or due to any other adverse or threatening conditions whether political or military or terrorist or otherwise if, in the absolute discretion of Vedic Travel, there is a likelihood of any such event occurring which may impact upon the safety of the participants, or if an act or omission of a third party prevents the tour or the aspect of the tour being undertaken in accordance with your booking.</li>
                                    </ul>
                                    <p>In the event of any change, modification, cancellation, postponement or delay under this condition, you acknowledge that you will have no right of refund of the tour price (whether in whole or in part) and no right to claim compensation for any injury, loss or damage or other additional expenses incurred by virtue of the change, modification, cancellation, postponement or delay. Vedic Travel also reserves, in its absolute discretion, the right to cancel any trip prior to departure due to any condition beyond our control.</p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">7. Insurance</h3>
                                    <p>
                                        Personal travel insurance is not included in the trip price. It is a condition of booking a trip with <strong>Vedic Travel</strong>, and your responsibility to ensure that you are adequately insured for the full duration of the trip in respect of illness, injury, death, loss of baggage and personal items, and cancellation and curtailment.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">8. Airlines</h3>
                                    <p>
                                        Any material published by <strong>Vedic Travel</strong>, the Booking Form, and these conditions of contract are not issued on behalf of, and do not commit any airline whose services are used or proposed to be used in the course of the trip. If an airline&apos;s proposed travel or fare schedule is amended or cancelled, such amendment or cancellation will not be considered a cancellation of the trip by <strong>Vedic Travel</strong>.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">9. Trip Prices</h3>
                                    <p>
                                        The prices are based on ground costs, fuel prices, airfares, exchange rates, and assumptions made at the printing of the brochure. <strong>Vedic Travel</strong> tries its utmost not to increase trip prices (in full or part); however, sometimes increases are outside its control. <strong>Vedic Travel</strong> reserves the right to amend trip prices (or any part) without notice at any time before and including the departure date. Amendments may be necessitated for many reasons, including, but not limited to, exchange rate fluctuations, increased fuel costs, airfares, airport charges, increases in ground operator service fees, or the need to engage alternative air or ground operators. Any increase in trip prices must be paid before the departure date.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">10. Assumption of Risk</h3>
                                    <p>
                                        You accept and agree to assume all risk associated with the journeys and further agree to abide by the terms and conditions of <strong>Vedic Travel</strong> as described herein and its brochures and publications. In the event of illness, accident, weather, political, or other factors beyond their control, I will not hold <strong>Vedic Travel</strong> and its agents, associates, or employees are responsible or liable for damages. I understand I am traveling at my own risk.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">11. Right to Contact</h3>
                                    <p>
                                        By putting a query on our website, you are authorizing <strong>Vedic Travel</strong> to contact you through phone calls/SMS/E-mail for information about your query/offers/alerts, or promotional information.
                                    </p>
                                    <p>
                                        <strong>Vedic Travel</strong> will send booking confirmation, itinerary information, cancellation, payment confirmation, refund status, schedule change or any such other information relevant for the transaction or booking made by the User, via SMS, internet-based messaging applications like WhatsApp, voice call, e-mail or any other alternate communication detail provided by the User at the time of booking.
                                    </p>
                                    <p>
                                        <strong>Vedic Travel</strong> may also contact the User through the modes mentioned above for any pending or failed bookings, to know the preference of the User for concluding the booking, and also to help the User with the same.
                                    </p>
                                    <p>
                                        The User hereby unconditionally consents that such communications via SMS, internet-based messaging applications like WhatsApp, voice call, email, or any other mode by <strong>Vedic Travel</strong> are:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-3">
                                        <li>Upon the request and authorization of the User;</li>
                                        <li>&apos;Transactional&apos; and not an &apos;unsolicited commercial communication&apos; as per the guidelines of the Telecom Regulation Authority of India (TRAI), and</li>
                                        <li>In compliance with the relevant guidelines of TRAI or such other authority in India and abroad.</li>
                                    </ul>
                                    <p>
                                        The User will indemnify <strong>Vedic Travel</strong> against all types of losses and damages incurred by <strong>Vedic Travel</strong> due to any action taken by TRAI, Access Providers (as per TRAI regulations) or any other authority due to any erroneous complaint raised by the User on <strong>Vedic Travel</strong> concerning the communications mentioned above or due to a wrong number or email id being provided by the User for any reason whatsoever.
                                    </p>
                                </section>

                                <section className="space-y-4 text-sm md:text-base">
                                    <h3 className="text-xl font-bold text-deepBlue">12. Refund</h3>
                                    <p>
                                        Any approved refund shall be processed within sixty (60) days from the date of receipt of the customer&apos;s written refund request and submission of the cancelled cheque details, and shall be credited to the customer&apos;s designated bank account.
                                    </p>
                                </section>
                            </div>

                            {/* Talk to Expert Section */}
                            <div className="mt-12 bg-white border border-gray-100 rounded-2xl p-8 shadow-md text-center">
                                <h3 className="text-2xl font-bold text-deepBlue mb-2">Talk to Yatra Expert</h3>
                                <p className="text-gray-600 mb-6">Submit your contact number. Our Expert will call you within 1 minute.</p>

                                <form onSubmit={handleExpertSubmit} className="max-w-xl mx-auto">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1 relative flex">
                                            <div className="bg-gray-50 border border-r-0 border-gray-300 px-4 flex items-center gap-2 text-gray-700 rounded-l-lg">
                                                <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
                                                <span className="font-semibold">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="Enter Mobile Number"
                                                value={expertMobile}
                                                onChange={(e) => setExpertMobile(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={expertLoading}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
                                        >
                                            {expertLoading ? '...' : 'Submit'}
                                        </button>
                                    </div>
                                    {expertStatus === 'success' && (
                                        <p className="text-green-600 mt-4 text-sm font-semibold flex items-center justify-center gap-2">
                                            <CheckCircle2 size={16} /> Request submitted! We&apos;ll call you shortly.
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Reach out to us form */}
                        <div className="bg-[#1D102A] p-8 rounded-2xl text-white shadow-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">Reach out to us</h3>
                                <p className="text-gray-400 text-sm">Have An Enquiry? Write To Us...</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Name *"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Email *"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                                    />
                                </div>

                                <div className="relative flex">
                                    <div className="bg-white border-r border-gray-200 px-3 flex items-center gap-1 text-gray-700 rounded-l-lg">
                                        <img src="https://flagcdn.com/w20/in.png" alt="India" className="w-5 h-3" />
                                        <span className="text-sm font-semibold">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        required
                                        placeholder="Phone Number *"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full bg-white text-gray-800 pr-4 py-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-saffron"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none text-gray-400">
                                        <MessageSquare size={18} />
                                    </div>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        placeholder="Comment"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-white text-gray-800 pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Sending...' : 'Submit'}
                                    {!loading && <Send size={18} className="transition-transform group-hover:translate-x-1" />}
                                </button>

                                {status === 'success' && (
                                    <p className="text-green-400 text-center text-sm mt-4 font-semibold flex items-center justify-center gap-2">
                                        <CheckCircle2 size={16} /> Inquiry sent successfully!
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="text-red-400 text-center text-sm mt-4 font-semibold">Something went wrong. Please try again.</p>
                                )}
                            </form>
                        </div>

                        {/* WhatsApp Banner */}
                        <a
                            href="https://wa.me/918447470062"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between bg-white border border-red-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500 p-2 rounded-full text-white">
                                    <MessageCircle size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-deepBlue text-sm">Connect on WhatsApp</h4>
                                    <p className="text-xs text-gray-500">Call on +91-8447470062 or WhatsApp</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-red-500 transition-transform group-hover:translate-x-1" />
                        </a>

                        <PopularPackagesSidebar />
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="mt-12 bg-white pt-16">
                <TestimonialsSection />
            </div>
        </main>
    );
}
