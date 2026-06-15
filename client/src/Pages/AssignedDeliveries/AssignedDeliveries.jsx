import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const AssignedDeliveries = () => {

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: parcels = [], refetch } = useQuery({
        queryKey: ['parcels', user?.email, 'driver_assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=driver_assigned`);
            return res.data;
        }
    });

    const handleDeliveryStatusUpdate = (parcel, status) => {
        const statusInfo = {
            deliveryStatus: status,
            riderId: parcel.riderId,
            trackingId: parcel.trackingId
        };

        let message = `Parcel status updated with ${status.split('_').join(' ')}`;
        axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo).then(res => {
            if (res.data.modifiedCount) {
                refetch();
                Swal.fire({
                    title: message,
                    icon: 'success',
                    iconColor: '#16a34a',
                    background: '#f0fdf4',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true
                });
            }
        });
    };

    return (
        <div>
            <h2 className="text-4xl font-bold mb-4">Parcels Pending Pickup: {parcels.length}</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Confirmation</th>
                            <th>Other Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            parcels.map((parcel, index) =>
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td>{parcel.name}</td>
                                    <td>
                                        {
                                            parcel.deliveryStatus === 'driver_assigned' ? <>
                                                <button
                                                    onClick={() => handleDeliveryStatusUpdate(parcel, 'rider_arriving')}
                                                    className="btn btn-primary text-secondary">Accept</button>
                                                <button className="btn btn-warning text-secondary ms-2">Reject</button>
                                            </> : <span className="text-secondary font-bold">Accepted</span>
                                        }
                                    </td>
                                    <td>
                                        <div class="flex gap-3">
                                            <button onClick={()=> handleDeliveryStatusUpdate(parcel, 'parcel_picked_up')} className="btn btn-outline btn-primary px-6 rounded-lg transition-all hover:scale-105 mx-2">
                                                Marked as Picked up
                                            </button>

                                            <button onClick={()=> handleDeliveryStatusUpdate(parcel, 'parcel_delivered')} className="btn btn-primary px-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105">
                                                Marked as Delivered

                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssignedDeliveries;