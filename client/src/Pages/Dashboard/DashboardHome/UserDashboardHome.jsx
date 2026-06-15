import React from 'react';
import { Link } from 'react-router';
import { FaBoxOpen, FaClockRotateLeft, FaLocationCrosshairs, FaPlus } from 'react-icons/fa6';
import { DashboardHero, Panel, StatCard } from './DashboardCards';

const UserDashboardHome = () => {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <DashboardHero
        eyebrow="Customer dashboard"
        title="Your parcel command center."
        description="Create delivery requests, complete payments, and follow your parcel journey from booking to doorstep."
        actions={[
          <Link key="send" to="/sendparcel" className="btn btn-primary rounded-full px-7 font-black text-secondary shadow-lg shadow-primary/30"><FaPlus /> Send a Parcel</Link>,
          <Link key="parcels" to="/dashboard/my-parcels" className="btn rounded-full border-white/20 bg-white/10 px-7 font-black text-white hover:bg-white/20">View My Parcels</Link>
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<FaBoxOpen />} label="Book Delivery" value="Send parcels" note="Create new courier requests with receiver details." />
        <StatCard icon={<FaClockRotateLeft />} label="Payments" value="Track history" note="Review successful and pending parcel payments." />
        <StatCard icon={<FaLocationCrosshairs />} label="Delivery Status" value="Follow updates" note="Check your parcel status from the dashboard table." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <Panel title="Courier workflow" subtitle="A simple delivery flow designed for customers.">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01', 'Book', 'Add sender, receiver, parcel type, and weight.'],
              ['02', 'Pay', 'Complete payment when the parcel is ready.'],
              ['03', 'Track', 'Follow delivery progress until completion.'],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-3xl bg-[#f6faf4] p-5">
                <p className="text-xs font-black text-primary">{step}</p>
                <h3 className="mt-2 text-xl font-black text-secondary">{title}</h3>
                <p className="mt-2 text-sm font-semibold text-secondary/55">{text}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Need fast action?" subtitle="Start from the most common dashboard tasks.">
          <div className="space-y-3">
            <Link to="/sendparcel" className="flex items-center justify-between rounded-2xl bg-secondary p-4 font-black text-white transition hover:-translate-y-0.5 hover:shadow-lg">Book a new delivery <span>→</span></Link>
            <Link to="/dashboard/my-parcels" className="flex items-center justify-between rounded-2xl bg-primary/30 p-4 font-black text-secondary transition hover:-translate-y-0.5 hover:bg-primary">Manage parcels <span>→</span></Link>
            <Link to="/dashboard/payment-history" className="flex items-center justify-between rounded-2xl bg-secondary/5 p-4 font-black text-secondary transition hover:-translate-y-0.5 hover:bg-secondary/10">Payment history <span>→</span></Link>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default UserDashboardHome;
