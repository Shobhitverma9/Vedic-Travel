'use client';

import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#fafbfc] pb-20 px-4 sm:px-6 lg:px-10" style={{ paddingTop: '180px' }}>
            <div className="max-w-7xl mx-auto pt-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
