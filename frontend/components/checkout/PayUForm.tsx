'use client';

import { useEffect, useRef } from 'react';

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
        <form ref={formRef} action={action} method="post" style={{ display: 'none' }}>
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
        </form>
    );
}
