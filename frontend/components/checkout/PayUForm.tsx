'use client';

import { useEffect, useRef } from 'react';
import Preloader from '@/components/shared/Preloader';

interface PayUFormProps {
    action: string;
    params: {
        key: string;
        txnid: string;
        amount: string;
        productinfo: string;
        firstname: string;
        email: string;
        phone: string;
        surl: string;
        furl: string;
        hash: string;
        udf1?: string;
        udf2?: string;
        udf3?: string;
        udf4?: string;
        udf5?: string;
    };
}

export default function PayUForm({ action, params }: PayUFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full h-48 relative mb-6">
                <Preloader fullScreen={false} />
            </div>
            
            <div className="max-w-md w-full space-y-6">
                
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#1A2332]">Redirecting to Secure Payment</h2>
                    <p className="text-gray-500">Please wait while we connect you to the payment gateway...</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-4">Taking too long? Or didn't redirect automatically?</p>
                    <form ref={formRef} action={action} method="post">
                        <input type="hidden" name="key" value={params.key} />
                        <input type="hidden" name="txnid" value={params.txnid} />
                        <input type="hidden" name="amount" value={params.amount} />
                        <input type="hidden" name="productinfo" value={params.productinfo} />
                        <input type="hidden" name="firstname" value={params.firstname} />
                        <input type="hidden" name="email" value={params.email} />
                        <input type="hidden" name="phone" value={params.phone} />
                        <input type="hidden" name="surl" value={params.surl} />
                        <input type="hidden" name="furl" value={params.furl} />
                        <input type="hidden" name="hash" value={params.hash} />
                        {params.udf1 && <input type="hidden" name="udf1" value={params.udf1} />}
                        {params.udf2 && <input type="hidden" name="udf2" value={params.udf2} />}
                        {params.udf3 && <input type="hidden" name="udf3" value={params.udf3} />}
                        {params.udf4 && <input type="hidden" name="udf4" value={params.udf4} />}
                        {params.udf5 && <input type="hidden" name="udf5" value={params.udf5} />}
                        
                        <button 
                            type="submit"
                            className="bg-[#1A2332] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors"
                        >
                            Click here to proceed manually
                        </button>
                    </form>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure 256-bit SSL Encrypted Connection
                </div>
            </div>
        </div>
    );
}
