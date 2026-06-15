import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserShield } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';

const UsersManagement = () => {

    const axiosSecure = useAxiosSecure();

    const [searchText, setSearchText] = useState([]);

    const { refetch, data: users = [] } = useQuery({
        queryKey: ['users', searchText],
        queryFn: async () => {
            //fetch users from the server
            const res = await axiosSecure.get(`/users?searchText=${searchText}`);
            return res.data;
        }
    });

    const handleMakeAdmin = (user) => {
        const roleInfo = { role: 'admin' }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();

                    Swal.fire({
                        title: `<span class="text-2xl font-bold text-slate-800">Role Updated!</span>`,
                        html: `
                        <div class="flex flex-col items-center gap-2">
                            <div class="p-3 bg-blue-50 rounded-full">
                                <img class="w-16 h-16 rounded-full border-2 border-blue-500" src="${user.photoURL}" alt="User" />
                            </div>
                            <p class="text-gray-600 mt-2">
                                <b>${user.displayName}</b> is now an <span class="text-blue-600 font-semibold">Admin</span>.
                            </p>
                            <p class="text-xs text-gray-400">
                                They now have full access to the management dashboard.
                            </p>
                        </div>
                    `,
                        icon: "success",
                        iconColor: "#3b82f6", // Admin Blue
                        background: "#ffffff",
                        showConfirmButton: true,
                        confirmButtonText: "Done",
                        confirmButtonColor: "#1e293b",
                        timer: 4000,
                        timerProgressBar: true,
                        backdrop: `rgba(15, 23, 42, 0.2) backdrop-filter: blur(4px)`,
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        },
                        customClass: {
                            popup: 'rounded-3xl border-none shadow-2xl',
                        }
                    });
                }
            })
    }

    const handleRemoveAdmin = (user) => {
        // confirmation
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to remove Admin privileges from ${user.displayName}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Yes, remove admin",
            cancelButtonText: "Cancel",
            background: "#ffffff",
            customClass: {
                popup: 'rounded-3xl border-none shadow-2xl',
                title: 'text-xl font-bold text-slate-800',
                confirmButton: 'rounded-xl px-6 py-3',
                cancelButton: 'rounded-xl px-6 py-3'
            },
            backdrop: `rgba(15, 23, 42, 0.2) backdrop-filter: blur(4px)`
        }).then((result) => {
            // proceed if the user confirmed
            if (result.isConfirmed) {
                const roleInfo = { role: 'user' };

                axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
                    .then(res => {
                        if (res.data.modifiedCount > 0) {
                            refetch();

                            //  Success Feedback
                            Swal.fire({
                                title: `<span class="text-2xl font-bold text-slate-800">Role Updated!</span>`,
                                html: `
                                <div class="flex flex-col items-center gap-2">
                                    <div class="p-3 bg-red-50 rounded-full">
                                        <img class="w-16 h-16 rounded-full border-2 border-red-500" src="${user.photoURL}" alt="User" />
                                    </div>
                                    <p class="text-gray-600 mt-2">
                                        <b>${user.displayName}</b> is no longer an <span class="text-red-600 font-semibold">Admin</span>.
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        They now have standard user access.
                                    </p>
                                </div>
                            `,
                                icon: "success",
                                iconColor: "#ef4444",
                                timer: 2500,
                                timerProgressBar: true,
                                showConfirmButton: false,
                                background: "#ffffff",
                                customClass: {
                                    popup: 'rounded-3xl border-none shadow-2xl',
                                }
                            });
                        }
                    });
            }
        });
    };

    return (
        <div>
            <h2 className='text-4xl mb-2'>Manage Users {users.length}</h2>
            <p className='font-semibold'>Search Text: {searchText}</p>

            <label className="input my-4">
                <svg className="h-[1em] opacity-50 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" className="grow" placeholder="Search" 
                onChange={(e) => setSearchText(e.target.value)}
                />
            </label>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead className='bg-base-300 text-base-content'>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Admin Action</th>
                            <th>Others Action</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img
                                                        src={user.photoURL}
                                                        alt="Avatar Tailwind CSS Component" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.displayName}</div>
                                                <div className="text-sm opacity-50">United States</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user.email}
                                    </td>
                                    <td>
                                        {user.role}
                                    </td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <button
                                                onClick={() => handleRemoveAdmin()}
                                                className="flex items-center gap-2 w-40 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
                                                title="Remove Admin"
                                            >
                                                <FiShieldOff className="text-lg" />
                                                Remove Admin
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleMakeAdmin(user)}
                                                className="flex items-center gap-2 w-40 px-4 py-2 border-2 border-green-500 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-all duration-200 shadow-md"
                                                title="Make Admin"
                                            >
                                                <FaUserShield className="text-lg" />
                                                Make Admin
                                            </button>
                                        )}
                                    </td>
                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;