import React from 'react';
import { Link } from 'react-router';
import { FaMotorcycle, FaRegCircleCheck, FaRoute } from 'react-icons/fa6';

const RiderDashboardHome = () => {
    return (
        <div className="p-4 md:p-8">
            <section className="rounded-[2rem] bg-secondary p-8 text-white shadow-xl">
                <p className="font-bold uppercase tracking-[0.25em] text-primary">Rider Dashboard</p>
                <h1 className="mt-3 text-4xl font-black">Deliver smarter with clear task flow</h1>
                <p className="mt-3 max-w-2xl text-white/70">Check assigned parcels, update delivery status, and review completed deliveries.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/dashboard/assigned-deliveries" className="btn btn-primary rounded-full text-secondary">Assigned Deliveries</Link>
                    <Link to="/dashboard/completed-deliveries" className="btn rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">Completed</Link>
                </div>
            </section>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaMotorcycle className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Active Jobs</h3><p className="mt-2 text-base-content/60">See pending pickup and active delivery work.</p></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaRoute className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Status Updates</h3><p className="mt-2 text-base-content/60">Move parcels through delivery milestones.</p></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaRegCircleCheck className="mb-4 text-3xl text-primary" /><h3 className="text-xl font-bold text-secondary">Completed Work</h3><p className="mt-2 text-base-content/60">Review successful deliveries.</p></div>
            </div>
        </div>
    );
};

export default RiderDashboardHome;
