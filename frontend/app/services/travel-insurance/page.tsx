import ComingSoon from '@/components/shared/ComingSoon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Travel Insurance | Coming Soon - Vedic Travel',
    description: 'Get travel insurance with Vedic Travel. Service coming soon!',
};

export default function TravelInsurancePage() {
    return (
        <ComingSoon
            title="Travel Insurance"
            icon="insurance"
            description="Travel with peace of mind. We're partnering with leading insurance providers to offer comprehensive coverage for your spiritual and leisure journeys."
        />
    );
}
