import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
        const endpoint = isObjectId ? `/tours/${slug}` : `/tours/slug/${slug}`;
        
        const res = await fetch(`${apiUrl}${endpoint}`, { next: { revalidate: 60 } });
        
        if (!res.ok) {
            return {
                title: 'Package Not Found | Vedic Travel',
            };
        }
        
        const tour = await res.json();
        const seo = tour.seo || {};
        
        return {
            title: seo.title || `${tour.title} | Vedic Travel`,
            description: seo.description || tour.description?.slice(0, 160) || `Book the best ${tour.title} package with Vedic Travel.`,
            keywords: seo.keywords || `${tour.title}, vedic travel, tour package, vacation`,
            icons: {
                icon: "/vt-icon.png",
            },
            openGraph: {
                title: seo.title || tour.title,
                description: seo.description || tour.description?.slice(0, 160),
                images: tour.images && tour.images.length > 0 ? [{ url: tour.images[0] }] : undefined,
            }
        };
    } catch (error) {
        console.error("Error generating metadata for package:", error);
        return {
            title: 'Package | Vedic Travel',
        };
    }
}

export default function PackageLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
