import ComingSoon from '@/components/shared/ComingSoon';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Visa Assistance | Coming Soon - Vedic Travel',
    description: 'Simplify your visa process with Vedic Travel. Service coming soon!',
};

export default function VisaAssistancePage() {
    return (
        <ComingSoon
            title="Visa Assistance"
            icon="visa"
            description="Navigating international travel requirements made easy. Our team is setting up a streamlined visa processing system to help you cross borders without the stress."
        />
    );
}
