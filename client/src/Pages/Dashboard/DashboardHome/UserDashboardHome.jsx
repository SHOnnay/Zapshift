import React from 'react';
import { Link } from 'react-router';
import { FaBoxOpen, FaClockRotateLeft, FaLocationCrosshairs } from 'react-icons/fa6';

const UserDashboardHome = () => {
    return (
        <div className="p-4 md:p-8">
            <section className="rounded-[2rem] bg-secondary p-8 text-white shadow-xl">
                <p className="font-bold uppercase tracking-[0.25em] text-primary">Customer Dashboard</p>
                <h1 className="mt-3 text-4xl font-black">Manage your parcel journey</h1>
                <p className="mt-3 max-w-2xl text-white/70">Create new parcel requests, pay delivery fees, and track every delivery status from one place.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/sendparcel" className="btn btn-primary rounded-full text-secondary">Send a Parcel</Link>
                    <Link to="/dashboard/my-parcels" className="btn rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">View My Parcels</Link>
                </div>
            </section>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaBoxOpen className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Book Delivery</h3><p className="mt-2 text-base-content/60">Submit parcel details and receiver information.</p></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaClockRotateLeft className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Payment History</h3><p className="mt-2 text-base-content/60">Review previous online transactions.</p></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaLocationCrosshairs className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Track Status</h3><p className="mt-2 text-base-content/60">Open tracking from your parcel table.</p></div>
            </div>
        </div>
    );
};

export default UserDashboardHome;
