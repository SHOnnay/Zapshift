import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import EmptyState from '../../../Components/State/EmptyState';
import PageLoader from '../../../Components/State/PageLoader';

const MyParcels = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch, isLoading } = useQuery({
        queryKey: ['my-parcels', user?.email],
        queryFn: async () => {
            //fetch user's parcels from the server
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        }
    });

    const handleParcelDelete = id => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                axiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire(
                                "Deleted!",
                                "Your parcel request has been deleted.",
                                "success"
                            );
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
    };

    const handlePayment = async (parcel) => {
        const paymentInfo = {
            parcelId: parcel._id,
            cost: parcel.cost,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName,
            trackingId: parcel.trackingId
        };

        const res = await axiosSecure.post('/payment-checkout-session', paymentInfo);
        window.location.assign(res.data.url);

    }

    if (isLoading) return <PageLoader message="Loading your parcels..." />;

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] bg-secondary p-6 text-white shadow-xl md:flex-row md:items-center">
                <div>
                    <p className="font-bold uppercase tracking-[0.25em] text-primary">My Parcels</p>
                    <h2 className="mt-2 text-3xl font-black">{parcels.length} parcel{parcels.length === 1 ? '' : 's'} found</h2>
                </div>
                <Link to="/sendparcel" className="btn btn-primary rounded-full text-secondary">Send New Parcel</Link>
            </div>

            {parcels.length === 0 ? (
                <EmptyState title="No parcels yet" message="Create your first parcel request and it will appear here with payment and tracking controls." actionLabel="Send a Parcel" actionTo="/sendparcel" />
            ) : (
            <div className="overflow-x-auto rounded-3xl bg-base-100 p-2 shadow-sm">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            {/* <th></th> */}
                            <th>#</th>
                            <th>Parcel</th>
                            <th>Cost</th>
                            <th>Payment</th>
                            <th>Tracking Id</th>
                            <th>Delivery Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            parcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.parcelName}</td>
                                    <td className="font-bold">${parcel.cost}</td>
                                    <td className="">
                                        {parcel.paymentStatus === 'paid'
                                            ? <span className="text-green-500 font-semibold">Paid</span>
                                            :
                                            <button onClick={() => handlePayment(parcel)} className="btn btn-primary btn-sm text-black">Pay</button>

                                        }
                                    </td>

                                    <td>
                                        <Link to={`/parcel-track/${parcel.trackingId}`} className="">
                                            {parcel.trackingId}
                                        </Link>
                                    </td>
                                    <td><span className="badge badge-outline capitalize">{parcel.deliveryStatus?.split('-').join(' ')}</span></td>
                                    <td>
                                        <button className="btn btn-square hover:bg-primary">
                                            <FaMagnifyingGlass />
                                        </button>
                                        <button className="btn btn-square hover:bg-primary">
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            onClick={() => { handleParcelDelete(parcel._id) }} className="btn btn-square hover:bg-primary">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
};

export default MyParcels;