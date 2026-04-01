import { ChevronRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface PayUWidgetProps {
    onViewPlans?: () => void;
}

const PayUWidget = ({ onViewPlans }: PayUWidgetProps) => {
    return (
        <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm mt-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">
                    Get <span className="font-bold text-gray-900">Credit Card EMIs</span> on 16+ Banks
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {/* Mock Bank Logos */}
                    <div className="w-6 h-6 rounded-full bg-orange-100 border border-white flex items-center justify-center text-[8px] font-bold text-orange-600" title="ICICI">
                        IC
                    </div>
                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] font-bold text-blue-800" title="HDFC">
                        HD
                    </div>
                    <div className="w-6 h-6 rounded-full bg-red-100 border border-white flex items-center justify-center text-[8px] font-bold text-red-600" title="Kotak">
                        KK
                    </div>
                    <div className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[8px] font-bold text-indigo-800" title="Citi">
                        CB
                    </div>
                    <div className="pl-3 text-[10px] text-gray-500 font-medium self-center">
                        & more
                    </div>
                </div>

                <button
                    onClick={onViewPlans}
                    className="flex items-center text-[10px] font-bold text-deepBlue hover:underline uppercase tracking-wide"
                >
                    View Plans <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
            </div>

            <div className="flex justify-end items-center mt-2 pt-2 border-t border-dashed border-gray-100">
                <div className="flex items-center gap-1 text-[9px] text-gray-500">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    <span>100% Secured by</span>
                    <span className="font-bold text-gray-700">payu</span>
                </div>
            </div>
        </div>
    );
};

export default PayUWidget;
