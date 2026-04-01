import ComingSoon from '@/components/shared/ComingSoon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hotel Reservations | Coming Soon - Vedic Travel',
    description: 'Book your hotels with Vedic Travel. Service coming soon!',
};

export default function HotelReservationsPage() {
    return (
        <ComingSoon
            title="Hotel Reservations"
            icon="hotel"
            description="Handpicked accommodations ranging from spiritual retreats to luxury resorts. We're finalizing our partnerships to ensure you get the best stays at the best prices."
        />
    );
}
