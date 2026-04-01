'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard, Percent, Landmark, Info } from 'lucide-react';

interface EMIPlan {
    tenure: number;
    interestRate: number;
    emi: number;
    totalAmount: number;
}

interface BankPlan {
    bank: string;
    plans: EMIPlan[];
}

interface EMIPlansModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourName: string;
    totalAmount: number;
    emiInfo: {
        lowestEmi: number;
        bankWisePlans: BankPlan[];
        allPlans: any[];
    } | null;
}

export default function EMIPlansModal({ isOpen, onClose, tourName, totalAmount, emiInfo }: EMIPlansModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative animate-slide-up flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-deepBlue">EMI Plans</h2>
                        <p className="text-sm text-gray-500 truncate max-w-[300px] mt-0.5">{tourName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-blue-50/50 rounded-xl p-4 mb-8 border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Package Value</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-green-600 font-bold mb-1 flex items-center justify-end gap-1">
                                <Percent size={14} className="bg-green-600 text-white rounded-full p-0.5" />
                                No Cost EMI Available
                            </p>
                            <p className="text-xs text-gray-500">Starting from ₹{emiInfo?.lowestEmi.toLocaleString('en-IN')}/mo</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {emiInfo?.bankWisePlans.map((bank, bankIdx) => (
                            <div key={bankIdx} className="space-y-4">
                                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                        <Landmark size={20} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{bank.bank}</h3>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                                <th className="py-2 px-4">Tenure (Months)</th>
                                                <th className="py-2 px-4">Interest Rate</th>
                                                <th className="py-2 px-4 text-right">Monthly EMI</th>
                                                <th className="py-2 px-4 text-right">Total Payable</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {bank.plans.map((plan, planIdx) => (
                                                <tr key={planIdx} className="text-sm group hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-semibold text-gray-900">{plan.tenure} Months</td>
                                                    <td className="py-3 px-4">
                                                        {plan.tenure <= 6 ? (
                                                            <span className="text-green-600 font-bold">0% (No Cost)</span>
                                                        ) : (
                                                            <span className="text-gray-500">{plan.interestRate}% p.a.</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-bold text-deepBlue">₹{plan.emi.toLocaleString('en-IN')}</td>
                                                    <td className="py-3 px-4 text-right text-gray-600">₹{plan.totalAmount.toLocaleString('en-IN')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div className="text-xs text-gray-500 leading-relaxed">
                                <p className="font-bold text-gray-700 mb-1">Important Note:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>Interest rates are indicative and subject to change by respective banks.</li>
                                    <li>No Cost EMI is typically available on select Credit Cards for tenures up to 6 months.</li>
                                    <li>A one-time processing fee may be charged by your bank.</li>
                                    <li>The final EMI amount and plan will be confirmed on the PayU secure payment page.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 text-center shrink-0">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                        <CreditCard size={12} />
                        Secured EMI powered by PayU
                    </p>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
