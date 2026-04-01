import ComingSoon from '@/components/shared/ComingSoon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cab Transfers | Coming Soon - Vedic Travel',
    description: 'Book your cab transfers with Vedic Travel. Service coming soon!',
};

export default function CabTransfersPage() {
    return (
        <ComingSoon
            title="Cab Transfers"
            icon="cab"
            description="Reliable and comfortable local transportation at your fingertips. We're building a network of trusted drivers to ensure your journey is safe and pleasant from door to door."
        />
    );
}
