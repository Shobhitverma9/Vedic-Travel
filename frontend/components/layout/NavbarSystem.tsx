'use client';

import { usePathname } from 'next/navigation';
import Marquee from './Marquee';
import TopBar from './TopBar';
import Header from './Header';

export default function NavbarSystem() {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 flex flex-col font-sans transition-all duration-300 ${isAuthPage ? 'bg-white shadow-md' : ''}`}>
            <Marquee />
            <TopBar />
            <Header isEmbedded={true} />
        </div>
    );
}
