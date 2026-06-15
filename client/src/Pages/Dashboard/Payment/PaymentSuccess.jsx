import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    console.log('Payment successful for session ID:', sessionId);

    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`).then(res => {
                console.log('Payment success updated on server:', res.data);
                setPaymentInfo({
                    transactionId: res.data.transactionId,
                    trackingId: res.data.trackingId,
                });
            }).catch(err => {
                console.error('Error updating payment success on server:', err);
            });
        }
    }, [sessionId, axiosSecure]);

    return (
        <div>
            <h2 className='mt-3 text-3xl font-extrabold' style={{ fontFamily: 'Courier New, monospace' }}>
                Payment Successful!
            </h2>
            <p className='mt-2' style={{ fontFamily: 'Arial, sans-serif' }}>
                Transaction ID: {paymentInfo?.transactionId}
            </p>
            <p className='mt-2' style={{ fontFamily: 'Arial, sans-serif' }}>
                Tracking ID: {paymentInfo?.trackingId}
            </p>
        </div>
    );
};

export default PaymentSuccess;