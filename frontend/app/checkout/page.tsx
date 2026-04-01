'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toursService } from '@/services/tours.service';
import { authService } from '@/services/auth.service';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ReviewStep from '@/components/checkout/ReviewStep';
import AuthStep from '@/components/checkout/AuthStep';
import TravellerStep, { Traveler, Address } from '@/components/checkout/TravellerStep';
import PaymentStep from '@/components/checkout/PaymentStep';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Booking Data
    // We expect tourId, date, adults from URL
    const tourId = searchParams.get('tourId');
    const dateParam = searchParams.get('date');
    const adultsParam = searchParams.get('adults');

    // Derived State
    const [tour, setTour] = useState<any>(null);
    const [bookingDetails, setBookingDetails] = useState({
        tourName: '',
        tourType: 'Group Tour', // Default or from tour data
        packageType: 'Standard', // Default or from tour data
        travelDate: dateParam ? new Date(dateParam) : new Date(),
        adults: adultsParam ? parseInt(adultsParam) : 2, // Default to 2 for now as per screenshots if missing
        costPerAdult: 0,
        currency: 'USD',
        exchangeRate: 84.00, // Fixed for demo, or fetch from API
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
                    if (allTours && allTours.data && allTours.data.length > 0) {
                        const demoTour = allTours.data[0];
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
                    // If user is already logged in, we could potentially skip step 2
                    // But for this flow, let's keep it to verify/confirm
                }
            } catch (e) {
                // Not logged in, that's fine
            }
        };

        fetchTourDetails();
        checkAuth();
    }, [tourId]);


    const handleReviewContinue = () => {
        // If already logged in, skip the auth step entirely
        setCurrentStep(isGuest ? 2 : 3);
        window.scrollTo(0, 0);
    };

    const handleAuthContinue = (email: string, guest: boolean) => {
        setUserEmail(email);
        setIsGuest(guest);
        setCurrentStep(3);
        window.scrollTo(0, 0);
    };

    const handleTravellerContinue = (travelers: Traveler[], address: Address) => {
        setTravelerDetails(travelers);
        setAddressDetails(address);
        setCurrentStep(4);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5722]"></div>
            </div>
        );
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
    const baseAmountInINR = bookingDetails.costPerAdult * bookingDetails.exchangeRate;
    const totalTourCost = baseAmountInINR * bookingDetails.adults;
    const gstAmount = totalTourCost * 0.05;
    const grandTotal = totalTourCost + gstAmount;

    return (
        <div className="min-h-screen bg-[#F8F6F2] pb-12">
            <CheckoutSteps currentStep={currentStep} />

            <div className="container mx-auto max-w-5xl px-4 pt-8">
                {currentStep === 1 && (
                    <ReviewStep
                        bookingDetails={bookingDetails}
                        onContinue={handleReviewContinue}
                    />
                )}

                {currentStep === 2 && (
                    <AuthStep
                        onContinue={handleAuthContinue}
                    />
                )}

                {currentStep === 3 && (
                    <TravellerStep
                        adults={bookingDetails.adults}
                        initialEmail={userEmail}
                        onContinue={handleTravellerContinue}
                    />
                )}

                {currentStep === 4 && (
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
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
