'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toursService } from '@/services/tours.service';
import { authService } from '@/services/auth.service';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ReviewStep from '@/components/checkout/ReviewStep';
import BookingAuthModal from '@/components/checkout/BookingAuthModal';
import TravellerStep, { Traveler, Address } from '@/components/checkout/TravellerStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import Preloader from '@/components/shared/Preloader';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Booking Data
    // We expect tourId, date, adults from URL
    const tourId = searchParams.get('tourId');
    const dateParam = searchParams.get('date');
    const adultsParam = searchParams.get('adults');
    const departureCityParam = searchParams.get('departureCity');
    const citySurchargeParam = searchParams.get('citySurcharge');
    const paidAmountParam = searchParams.get('paidAmount');

    // Derived State
    const [tour, setTour] = useState<any>(null);
    const [bookingDetails, setBookingDetails] = useState({
        tourName: '',
        tourType: 'Group Tour', // Default or from tour data
        packageType: 'Standard', // Default or from tour data
        travelDate: dateParam ? new Date(dateParam) : new Date(),
        adults: adultsParam ? parseInt(adultsParam) : 2, // Default to 2 for now as per screenshots if missing
        costPerAdult: 0,
        currency: 'INR',
        exchangeRate: 1.00, // No conversion needed as price is already in INR
        departureCity: departureCityParam || 'Joining Direct',
        citySurcharge: citySurchargeParam ? parseFloat(citySurchargeParam) : 0,
    });

    // User Data
    const [userEmail, setUserEmail] = useState('');
    const [isGuest, setIsGuest] = useState(true);

    // Traveller Data
    const [travelerDetails, setTravelerDetails] = useState<Traveler[]>([]);
    const [addressDetails, setAddressDetails] = useState<Address | null>(null);

    useEffect(() => {
        const fetchTourDetails = async () => {
            if (!tourId) {
                // For development/demo purposes, if no tourId, we might want to mock or redirect
                // setError('No tour selected');
                // setIsLoading(false);
                // return;

                // DEMO MODE: If no tourId, fetch the first available tour or use mock data
                try {
                    const allTours = await toursService.getAllTours();
                    if (allTours && allTours.tours && allTours.tours.length > 0) {
                        const demoTour = allTours.tours[0];
                        setTour(demoTour);
                        setBookingDetails(prev => ({
                            ...prev,
                            tourName: demoTour.title,
                            costPerAdult: demoTour.price || 908, // Fallback price
                            tourType: demoTour.packageType || 'Group Tour',
                        }));
                    }
                } catch (e) {
                    console.error("Failed to fetch demo tour", e);
                    // Fallback mock
                    setBookingDetails(prev => ({
                        ...prev,
                        tourName: 'Sri Lanka Ramayan Anant Yatra - Veg Guided Darshan Tour',
                        costPerAdult: 908,
                    }));
                }
                setIsLoading(false);
                return;
            }

            try {
                const data = await toursService.getTourById(tourId);
                setTour(data);
                setBookingDetails(prev => ({
                    ...prev,
                    tourName: data.title,
                    costPerAdult: data.price || 908,
                    tourType: data.packageType || 'Group Tour',
                }));
            } catch (err) {
                console.error('Error fetching tour:', err);
                setError('Failed to load tour details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        const checkAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    setUserEmail(user.email);
                    setIsGuest(false);
                    setIsAuthModalOpen(false);
                }
            } catch (e) {
                // Not logged in! Enforce authentication!
                setIsAuthModalOpen(true);
            }
        };

        fetchTourDetails();
        checkAuth();
    }, [tourId]);

    // Initial load from localStorage
    useEffect(() => {
        if (!tourId) return;
        const savedDraft = localStorage.getItem(`checkout_draft_${tourId}`);
        if (savedDraft) {
            try {
                const parsed = JSON.parse(savedDraft);
                // We no longer restore currentStep from localStorage to avoid jumping users 
                // between different versions of the checkout flow. They should always start at Review.
                if (parsed.userEmail) setUserEmail(parsed.userEmail);
                if (parsed.isGuest !== undefined) setIsGuest(parsed.isGuest);
                if (parsed.travelerDetails) setTravelerDetails(parsed.travelerDetails);
                if (parsed.addressDetails) setAddressDetails(parsed.addressDetails);
            } catch (e) {
                console.error("Failed to load checkout draft", e);
            }
        }
        setIsLoaded(true);
    }, [tourId]);

    // Save to localStorage
    useEffect(() => {
        if (!isLoaded || !tourId) return;
        const draft = {
            currentStep,
            userEmail,
            isGuest,
            travelerDetails,
            addressDetails
        };
        localStorage.setItem(`checkout_draft_${tourId}`, JSON.stringify(draft));
    }, [currentStep, userEmail, isGuest, travelerDetails, addressDetails, tourId, isLoaded]);

    const handleReviewContinue = () => {
        setCurrentStep(2);
        window.scrollTo(0, 0);
    };

    const handleTravellerContinue = (travelers: Traveler[], address: Address) => {
        setTravelerDetails(travelers);
        setAddressDetails(address);
        setCurrentStep(3);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return <Preloader />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-red-500 font-bold">{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="text-blue-600 hover:underline"
                >
                    Go back home
                </button>
            </div>
        );
    }

    // Calculate total for PaymentStep
    const baseAmountInINR = (bookingDetails.costPerAdult + bookingDetails.citySurcharge);
    const totalTourCost = baseAmountInINR * bookingDetails.adults;
    const gstAmount = totalTourCost * 0.05;
    const fullGrandTotal = totalTourCost + gstAmount;
    
    // If paidAmount was passed in URL, use it, otherwise use full grand total
    const grandTotal = paidAmountParam ? parseFloat(paidAmountParam) : fullGrandTotal;

    return (
        <div className="min-h-screen bg-[#F8F6F2] pb-12">
            <CheckoutSteps currentStep={currentStep} />

            <div className="container mx-auto max-w-5xl px-4 pt-8">
                {currentStep === 1 && (
                    <ReviewStep
                        bookingDetails={bookingDetails}
                        paidAmount={grandTotal}
                        onContinue={handleReviewContinue}
                    />
                )}

                {currentStep === 2 && (
                    <TravellerStep
                        adults={bookingDetails.adults}
                        initialEmail={userEmail}
                        onContinue={handleTravellerContinue}
                    />
                )}

                {currentStep === 3 && (
                    <PaymentStep
                        totalAmount={grandTotal}
                        bookingDetails={bookingDetails}
                        travelerDetails={travelerDetails}
                        addressDetails={addressDetails}
                        tour={tour}
                        isGuest={isGuest}
                        userEmail={userEmail}
                    />
                )}

                {/* Catch-all for invalid steps causing blank page */}
                {!isLoading && currentStep > 3 && (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-500 mb-4">Something went wrong with the checkout configuration.</p>
                        <button 
                            onClick={() => setCurrentStep(1)}
                            className="bg-[#FF5722] text-white px-6 py-2 rounded-lg font-bold"
                        >
                            Reset Checkout
                        </button>
                    </div>
                )}
            </div>

            {/* Auth Modal overlay for when direct links bypass upstream auth checks */}
            <BookingAuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => router.push('/')} 
                returnUrl={`${pathname}?${searchParams.toString()}`}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    // Rerun checkAuth to populate user detail state natively
                    authService.getCurrentUser().then(user => {
                        if (user) {
                            setUserEmail(user.email);
                            setIsGuest(false);
                        }
                    }).catch(console.error);
                }}
            />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<Preloader />}>
            <CheckoutContent />
        </Suspense>
    );
}
