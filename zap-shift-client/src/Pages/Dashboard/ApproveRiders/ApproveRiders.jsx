import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaEye, FaUserCheck } from 'react-icons/fa';
import { IoPersonRemoveSharp } from 'react-icons/io5';
import { FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
// import confetti from 'canvas-confetti';

const ApproveRiders = () => {

    const axiosSecure = useAxiosSecure();
    const {refetch, data: riders = [] } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            //fetch riders with pending status from the server
            const res = await axiosSecure.get('/riders');
            return res.data;
        }
    });

    const updateRiderStatus = (rider, status) => {
        const updateInfo = {
            status: 'approved',
            email: rider.email
        };
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch(); 
                    Swal.fire({
                        title: `<strong>Rider ${status === 'approved' ? 'Approved' : 'Rejected'}!</strong>`,
                        html: `
                                <div class="text-center">
                                <p class="text-gray-600">
                                ${status === 'approved'
                                ? 'The rider is now part of the <b>Zap Shift</b> fleet.'
                                : 'The rider application has been declined.'}
                                </p>
                                <p class="mt-2 text-sm text-gray-400">
                                ${status === 'approved'
                                ? 'They can now start accepting delivery requests.'
                                : 'They will be notified of this decision shortly.'}
                                </p>
                                </div>
                            `,
                        // Dynamic icon and colors
                        icon: status === 'approved' ? "success" : "error",
                        iconColor: status === 'approved' ? "#22c55e" : "#ef4444", // Green vs Red
                        background: "#ffffff",
                        showConfirmButton: true,
                        confirmButtonText: status === 'approved' ? "Great!" : "Done",
                        confirmButtonColor: "#1e293b",
                        buttonsStyling: true,
                        timer: 3000,
                        timerProgressBar: true,
                        backdrop: `
                        rgba(15, 23, 42, 0.4)
                        backdrop-filter: blur(8px)
                        `,
                        showClass: {
                            popup: 'animate__animated animate__zoomIn'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__zoomOut'
                        },
                        customClass: {
                            title: 'text-2xl font-bold text-slate-800',
                            popup: 'rounded-3xl border-none shadow-2xl',
                        }
                    });
                }
            }).catch(err => {
                console.error('Error approving rider:', err);
            });
    }

    const handleApproval = (rider) => {
        //send approval request to the server
        updateRiderStatus(rider, 'approved');
    };

    const handleRejection = (rider) => {
        //send rejection request to the server
        updateRiderStatus(rider, 'rejected');
    }

    return (
        <div>
            <h3>Approve Riders</h3>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr className='text-secondary font-bold '>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>District</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders.map((rider, index) => (
                                <tr key={rider}>
                                    <th>{index + 1}</th>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.district}</td>
                                    <td>
                                        <p className={`badge ${rider.status === 'approved' ? 'badge-success' : rider.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                            {rider.status}
                                        </p>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">

                                            <button
                                                className="btn btn-ghost btn-sm btn-square hover:bg-gray-200 group"
                                                title="Approve Rider"
                                            >
                                                <FaEye className="size-5 text-gray-500 group-hover:scale-110 transition-transform" />
                                            </button>
                                            {/* Approve Button */}
                                            <button
                                                onClick={() => handleApproval(rider)}
                                                className="btn btn-ghost btn-sm btn-square hover:bg-green-100 group"
                                                title="Approve Rider"
                                            >
                                                <FaUserCheck className="size-5 text-green-500 group-hover:scale-110 transition-transform" />
                                            </button>
                                            

                                            {/* Remove Role Button */}
                                            <button
                                                onClick={() => handleRejection(rider._id)}
                                                className="btn btn-ghost btn-sm btn-square hover:bg-orange-100 group"
                                                title="Remove Role"
                                            >
                                                <IoPersonRemoveSharp className="size-5 text-orange-500 group-hover:scale-110 transition-transform" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                className="btn btn-ghost btn-sm btn-square hover:bg-red-100 group"
                                                title="Delete Rider"
                                            >
                                                <FaTrashCan className="size-5 text-red-500 group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
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

export default ApproveRiders;