import React from 'react';
import { Link } from 'react-router';
import { FaMotorcycle, FaRegCircleCheck, FaRoute } from 'react-icons/fa6';
import { DashboardHero, Panel, StatCard } from './DashboardCards';

const RiderDashboardHome = () => {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <DashboardHero
        eyebrow="Rider dashboard"
        title="Pickup, deliver, update."
        description="A focused courier workspace for assigned parcels, active delivery milestones, and completed work."
        actions={[
          <Link key="assigned" to="/dashboard/assigned-deliveries" className="btn btn-primary rounded-full px-7 font-black text-secondary shadow-lg shadow-primary/30">Assigned Deliveries</Link>,
          <Link key="completed" to="/dashboard/completed-deliveries" className="btn rounded-full border-white/20 bg-white/10 px-7 font-black text-white hover:bg-white/20">Completed Work</Link>
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<FaMotorcycle />} label="Active Jobs" value="Assigned parcels" note="See pickup and delivery tasks ready for action." />
        <StatCard icon={<FaRoute />} label="Route Flow" value="Update status" note="Move parcels through courier milestones." />
        <StatCard icon={<FaRegCircleCheck />} label="History" value="Completed work" note="Review deliveries that reached the customer." />
      </div>

      <Panel title="Rider workflow" subtitle="Built around clear delivery actions.">
        <div className="grid gap-4 md:grid-cols-4">
          {['Assigned', 'Picked Up', 'In Transit', 'Delivered'].map((item, index) => (
            <div key={item} className="relative rounded-3xl bg-[#f6faf4] p-5">
              <p className="text-xs font-black text-primary">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-black text-secondary">{item}</h3>
              <div className="mt-5 h-1 rounded-full bg-secondary/10"><div className="h-1 rounded-full bg-primary" style={{ width: `${(index + 1) * 25}%` }} /></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export default RiderDashboardHome;
