'use client';

import React from 'react';
import ContactForm from '@/components/contact/ContactForm';
import PopularPackagesSidebar from '@/components/contact/PopularPackagesSidebar';
import TalkToExpert from '@/components/home/TalkToExpert';

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-cream-light font-sans">
            {/* Hero Banner Section */}
            <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
                            Vedic Travel Privacy Policy
                        </h1>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 max-w-7xl py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-3xl font-bold text-deepBlue mb-8">Vedic Travel Privacy Policy</h2>

                        <div className="max-w-none text-gray-700 space-y-8 leading-relaxed">
                            <div className="space-y-4">
                                <p className="font-bold text-deepBlue tracking-wide">PRIVACY POLICY :</p>

                                <ul className="space-y-4">
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"You"</strong> means 'the person browsing or using our Website <a href="https://vedictravel.com" className="text-red-600 hover:underline font-medium">www.vedictravel.com</a> for any purpose'.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"Website"</strong> represents <a href="https://vedictravel.com" className="text-red-600 hover:underline font-medium">www.vedictravel.com</a></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"Use"</strong> means browsing, accessing, and sourcing information/data using <a href="https://vedictravel.com" className="text-red-600 hover:underline font-medium">www.vedictravel.com</a></span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"Customer"</strong> means anyone who is taking any kind of free/paid service/information from the website <a href="https://vedictravel.com" className="text-red-600 hover:underline font-medium">www.vedictravel.com</a> or Vedic Travel as a Company</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"We", "Us", "Our Team", "Company"</strong> mean Vedic Travel as a company.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-saffron font-bold">•</span>
                                        <span><strong>"Privacy Policy"</strong> defines the terms that customers agree to while using our Website.</span>
                                    </li>
                                </ul>
                            </div>

                            <p>
                                Vedic Travel values your association & trust & puts our consistent efforts to ensure a very high level of data security & privacy of your personal information available with us.
                            </p>

                            <p>
                                Privacy Policy is subject to change, and we keep updating it without notice. We request you to check it periodically & while using our Website to see updates on the current Privacy Policy & information.
                            </p>

                            <p>
                                If you disagree or have any difference/conflict/confusion on any Privacy term/information/content published on the Website <a href="https://vedictravel.com" className="text-red-600 hover:underline font-medium">www.vedictravel.com</a>, we request you not to use the Website for any purpose & close it immediately. By visiting this Website, you are unconditionally agreeing to all the Privacy Terms & Policies of the Website.
                            </p>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-deepBlue uppercase mb-4 tracking-wider">PERSONAL INFORMATION:</h3>
                                <div className="space-y-4">
                                    <p>
                                        It's our consistent endeavour to enhance user experience & service. To ensure it, we gather & maintain a record of various information gathered while you are visiting the Website or providing it voluntarily. Such information can be used for research, enhancing user experience, recommendations, servicing, suggestions, or any related activities.
                                    </p>
                                    <p>
                                        By visiting our Website or by sharing any personal information in any form, you are unconditionally allowing us to gather your personal information & maintain the records of it.
                                    </p>
                                    <p>
                                        If you are not comfortable/convinced / agree with any of the forms/pages or any part of the Website, we sincerely request that you not share the information & leave the Website immediately. You always have the option not to share your information in forms or not to visit our Website.
                                    </p>
                                    <p>
                                        The information we store could be like: Information shared by you in forms/format, your server IP address, the browser you are using, your activities & interests, operating system or any other shared/provided/available information which may be relevant in enhancing business/service/user experience or any relevant activity. Some of this information may be shared with our business associates/partners/employees / relevant authorities as & when required or useful for business or customers for some specific purposes.
                                    </p>
                                    <p>
                                        By submitting/sharing your personal information, you authorise us to contact you through email, Mobile No of any other channel of communication for product, service delivery, and promotions. We may store such information along with your browsing behaviour, order pattern, delivery details, some credit card /debit card or any other payment instrument details, which may be used for service, promotion, product delivery, or any other business-related purpose.
                                    </p>
                                    <p>
                                        Time to time, we may ask you to participate in certain surveys where, along with your inputs, we may capture some other information related to your demographic location, browser, operating system & some other information. Such information can be used by us for any kind of business activity.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-deepBlue uppercase mb-4 tracking-wider">COOKIES</h3>
                                <div className="space-y-4">
                                    <p>
                                        Cookies are small files that may automatically be saved on your computer's hard disk. You can stop cookies from saving on your computer drive by making the necessary settings changes in your browser. If you block cookies through browser settings but then it may have some adverse impact on Your Website experience. We may use cookie data to enhance user experience/research, or for other internal uses.
                                    </p>
                                    <p>
                                        While you are visiting the Website, some of your information may be directly / indirectly captured/ automatically stored by the server (which may be third-party/outsourced) in the form of cookies / log files or any other form that may be used by an outsourced service provider.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-deepBlue uppercase mb-4 tracking-wider">SECURITY:</h3>
                                <p>
                                    It's our consistent endeavour to ensure that we put our best capabilities to ensure the best possible security solution.
                                </p>
                            </div>

                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-deepBlue uppercase mb-4 tracking-wider">THIRD PARTY WEBSITES LINK</h3>
                            <div className="space-y-4">
                                <p>
                                    As part of the business, third-party business links may be shared on our website. When you click the advertisement link, you may be directed to some external link where this Privacy Policy will not be applied & and another Link/Website may obtain/store/download some information directly from your computer. We do not have control over external links, so clicking on such links is solely your decision & we don't recommend any external advertisement/product/service/link.
                                </p>
                                <p>
                                    For any clarification on our Privacy Policy, you can write to us at <a href="mailto:bookings@vedictravel.com" className="text-red-600 hover:underline font-medium">bookings@vedictravel.com</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Right Column - Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <ContactForm />
                        <PopularPackagesSidebar />
                    </aside>
                </div>
            </div>

            {/* Talk To Expert Section */}
            <div className="bg-white border-t border-gray-100">
                <TalkToExpert />
            </div>
        </main>
    );
}
