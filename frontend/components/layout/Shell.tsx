'use client';

import { usePathname } from 'next/navigation';
import NavbarSystem from './NavbarSystem';
import Footer from './Footer';

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdmin && <NavbarSystem />}
            <main className="min-h-screen">
                {children}
            </main>
            {!isAdmin && <Footer />}
        </>
    );
}
