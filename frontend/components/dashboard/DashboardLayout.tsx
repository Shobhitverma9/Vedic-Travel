'use client';

import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#fafbfc] pb-20 px-4 sm:px-6 lg:px-10">
            {/* Spacer to clear the fixed height of NavbarSystem (Marquee + TopBar + Header) */}
            <div className="h-40 md:h-44 w-full" aria-hidden="true"></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
