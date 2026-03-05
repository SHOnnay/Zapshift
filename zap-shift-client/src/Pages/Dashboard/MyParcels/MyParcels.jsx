import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyParcels = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['my-parcels', user?.email],
        queryFn: async () => {
            //fetch user's parcels from the server
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data;
        }
    });

    const handleParcelDelete = id => {
        console.log('deleted id', id);
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
            parcelName: parcel.parcelName
        };

        const res= await axiosSecure.post('/payment-checkout-session', paymentInfo);
        window.location.href = res.data.url;
             
    }


    return (
        <div>
            <h2>Show all my parcels : {parcels.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            {/* <th></th> */}
                            <th>#</th>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Payment</th>
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
                                    <td>{parcel.cost}</td>
                                    <td className="text-center">
                                        {parcel.paymentStatus === 'paid'
                                            ? <span className="text-green-500 font-semibold">Paid</span>
                                            :
                                            <button onClick={() => handlePayment(parcel)} className="btn btn-primary btn-sm text-black">Pay</button>

                                        }
                                    </td>

                                    <td>{parcel.deliveryStatus}</td>
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
        </div>
    );
};

export default MyParcels;