import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Payment = () => {

    const { parcelId } = useParams();

    const axiosSecure = useAxiosSecure();

    const { isLoading, data: parcel } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    const handlePayment = async () => {

        const paymentInfo = {
            parcelId: parcel._id,
            cost: Number(parcel.cost),
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName
        };

        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);

        window.location.href = res.data.url;
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Please pay ${parcel.cost} for: {parcel.parcelName}</h2>
            <button onClick={handlePayment} className='btn btn-primary text-black font-semibold'>Pay Now</button>
        </div>
    );
};

export default Payment;