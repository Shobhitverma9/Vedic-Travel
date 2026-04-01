import ComingSoon from '@/components/shared/ComingSoon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Flight Bookings | Coming Soon - Vedic Travel',
    description: 'Book your flights with Vedic Travel. Service coming soon!',
};

export default function FlightBookingsPage() {
    return (
        <ComingSoon
            title="Flight Bookings"
            icon="flight"
            description="We're integrating with global airlines to bring you the best fares and seamless booking experience. Your journey to the divine is about to take flight!"
        />
    );
}
