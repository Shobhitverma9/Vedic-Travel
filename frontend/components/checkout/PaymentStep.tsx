import { useEffect, useState } from 'react';
import { CreditCard, Lock, Percent, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import PayUForm from './PayUForm';
import { bookingsService } from '@/services/bookings.service';
import { paymentsService } from '@/services/payments.service';

interface PaymentStepProps {
    totalAmount: number;
    bookingDetails: any;
    travelerDetails: any;
    addressDetails: any;
    tour: any;
    isGuest: boolean;
    userEmail: string;
}

export default function PaymentStep({
    totalAmount,
    bookingDetails,
    travelerDetails,
    addressDetails,
    tour,
    isGuest,
    userEmail
}: PaymentStepProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    const [emiInfo, setEmiInfo] = useState<any>(null);
    const [selectedMethod, setSelectedMethod] = useState<'full' | 'emi'>('full');

    useEffect(() => {
        const fetchEmi = async () => {
            try {
                const data = await paymentsService.getEmiOptions(totalAmount);
                setEmiInfo(data);
            } catch {
                // EMI info unavailable
            }
        };
        fetchEmi();
    }, [totalAmount]);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const mappedTravelers = travelerDetails.map((t: any) => ({
                name: `${t.title ? t.title + ' ' : ''}${t.firstName} ${t.lastName}`.trim(),
                age: t.dob
                    ? Math.floor((Date.now() - new Date(t.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                    : 25,
                gender: t.title === 'Mrs' || t.title === 'Ms' ? 'Female' : 'Male',
                idProof: 'Passport',
            }));

            let booking;

            if (isGuest) {
                const guestPayload = {
                    items: [{ tourId: tour._id, quantity: bookingDetails.adults, travelDate: bookingDetails.travelDate }],
                    travelerDetails: mappedTravelers,
                    email: addressDetails?.email || userEmail,
                    phone: addressDetails?.mobile || '',
                    specialRequests: '',
                    billingAddress: addressDetails,
                };
                const response = await bookingsService.createGuestBooking(guestPayload);
                const bookingId = response.bookings?.[0] || response._id;
                booking = { _id: bookingId };
            } else {
                const bookingPayload = {
                    tourId: tour._id,
                    numberOfTravelers: bookingDetails.adults,
                    travelDate: bookingDetails.travelDate,
                    travelerDetails: mappedTravelers,
                    specialRequests: '',
                    email: addressDetails?.email || userEmail,
                    phone: addressDetails?.mobile || '',
                    billingAddress: addressDetails,
                };
                booking = await bookingsService.createBooking(bookingPayload);
            }

            if (!booking || !booking._id) throw new Error('Failed to create booking');

            const paymentResponse = await paymentsService.initiatePayment(booking._id);
            setPaymentData(paymentResponse);
        } catch (error) {
            console.error('Payment initiation failed', error);
            alert('Failed to initiate payment. Please try again.');
            setIsProcessing(false);
        }
    };

    const trustBadges = ['SSL Secured', '100% Safe', 'Instant Confirmation'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Options — 2/3 */}
            <div className="lg:col-span-2 space-y-5">
                {/* Amount Banner */}
                <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-extrabold text-white">₹{totalAmount.toLocaleString('en-IN')}</p>
                        {emiInfo?.lowestEmi && (
                            <p className="text-[#D4AF37] text-xs font-semibold mt-1 flex items-center gap-1">
                                <Percent size={11} />
                                No Cost EMI from ₹{emiInfo.lowestEmi.toLocaleString('en-IN')}/mo
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-white/40 text-xs">Includes all taxes</p>
                        <p className="text-white/40 text-xs">& convenience fees</p>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1A2332] to-[#2C3E50] px-6 py-4">
                        <h2 className="text-white font-bold text-base">Choose Payment Method</h2>
                    </div>

                    <div className="p-5 space-y-3">
                        {/* Full Payment */}
                        <div
                            onClick={() => setSelectedMethod('full')}
                            className={`
                                group rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all border-2
                                ${selectedMethod === 'full'
                                    ? 'border-[#FF5722] bg-orange-50/50'
                                    : 'border-gray-100 hover:border-[#FF5722]/40 bg-white'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all
                                    ${selectedMethod === 'full' ? 'bg-[#FF5722] text-white' : 'bg-orange-50 text-[#FF5722]'}`}>
                                    <CreditCard size={22} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1A2332] text-sm">Pay Full Amount</p>
                                    <p className="text-xs text-gray-400">Cards · Net Banking · UPI · Wallets</p>
                                </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center
                                ${selectedMethod === 'full' ? 'border-[#FF5722] bg-[#FF5722]' : 'border-gray-300'}`}>
                                {selectedMethod === 'full' && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                        </div>

                        {/* EMI Payment */}
                        {emiInfo && (
                            <div
                                onClick={() => setSelectedMethod('emi')}
                                className={`
                                    group rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all border-2
                                    ${selectedMethod === 'emi'
                                        ? 'border-[#FF5722] bg-orange-50/50'
                                        : 'border-gray-100 hover:border-[#FF5722]/40 bg-white'}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all
                                        ${selectedMethod === 'emi' ? 'bg-[#FF5722] text-white' : 'bg-orange-50 text-[#FF5722]'}`}>
                                        <Percent size={22} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-[#1A2332] text-sm">Easy Monthly EMI</p>
                                            <span className="text-[10px] bg-[#D4AF37] text-[#1A2332] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                Popular
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">Starting ₹{emiInfo.lowestEmi?.toLocaleString('en-IN')}/month</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center
                                    ${selectedMethod === 'emi' ? 'border-[#FF5722] bg-[#FF5722]' : 'border-gray-300'}`}>
                                    {selectedMethod === 'emi' && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`
                        w-full py-4 rounded-xl font-bold text-white text-base shadow-lg flex items-center justify-center gap-2
                        transition-all duration-200
                        ${isProcessing
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-[#FF5722] hover:bg-[#E64A19] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-orange-200'}
                    `}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-gray-400/30 border-t-gray-500 rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Proceed to Secure Payment
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <Lock size={12} className="text-[#FF5722]" />
                    256-bit SSL encrypted · Your payment is completely safe
                </p>
            </div>

            {/* Right — Trust & Summary Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                    {/* Trust badges */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-bold text-[#1A2332] mb-3">Why book with us?</h3>
                        <ul className="space-y-3">
                            {[
                                { icon: '🛡️', title: 'Secure Payments', desc: 'Bank-grade encryption on all transactions' },
                                { icon: '✅', title: 'Instant Confirmation', desc: 'Booking voucher sent to your email' },
                                { icon: '🔄', title: 'Easy Cancellation', desc: 'Flexible policies on most tours' },
                                { icon: '📞', title: '24/7 Support', desc: 'Our team is always here for you' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">{item.icon}</span>
                                    <div>
                                        <p className="text-xs font-semibold text-[#1A2332]">{item.title}</p>
                                        <p className="text-[11px] text-gray-400">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Trust badges row */}
                    <div className="flex gap-2 justify-center">
                        {trustBadges.map(badge => (
                            <span key={badge} className="flex items-center gap-1 text-[10px] font-semibold text-[#1A2332]/60 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
                                <CheckCircle size={10} className="text-green-500" />
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {paymentData && (
                <PayUForm
                    action={paymentData.paymentUrl}
                    params={paymentData.paymentData}
                />
            )}
        </div>
    );
}
