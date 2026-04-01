"use client";

import React from "react";
import ContactHeader from "@/components/contact/ContactHeader";
import OfficeInfo from "@/components/contact/OfficeInfo";
import ContactForm from "@/components/contact/ContactForm";
import PopularPackagesSidebar from "@/components/contact/PopularPackagesSidebar";
import Reachability from "@/components/contact/Reachability";
import TalkToExpert from "@/components/home/TalkToExpert";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-cream-light font-sans">
            {/* 1. Chalkboard Header */}
            <ContactHeader />

            <div className="container mx-auto px-4 max-w-7xl py-12">
                <h1 className="text-4xl font-bold text-deepBlue mb-10 text-left">Contact Us!</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column (8 units) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 2. Office Info (Address, Call, Email) */}
                        <OfficeInfo />

                        {/* 3. Reachability (How to reach) */}
                        <Reachability />
                    </div>

                    {/* Right Column (4 units) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* 4. Contact Form */}
                        <ContactForm />

                        {/* 6. Popular Packages */}
                        <PopularPackagesSidebar />
                    </div>
                </div>
            </div>

            {/* 7. Talk to Expert Section */}
            <div className="bg-white border-t border-gray-100">
                <TalkToExpert />
            </div>

            {/* 8. Testimonials Section (Same as Home Page) */}
            <TestimonialsSection />
        </main>
    );
}

