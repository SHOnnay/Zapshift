import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { FaBoxOpen, FaMotorcycle, FaRoute, FaUsersGear } from 'react-icons/fa6';
import { Link } from 'react-router';
import PageLoader from '../../../Components/State/PageLoader';
import { DashboardHero, Panel, StatCard } from './DashboardCards';

const CHART_COLORS = ['#03373D', '#CAEB66', '#38BDF8', '#FB7185', '#A78BFA', '#F59E0B'];

const formatStatus = (status) => String(status || 'unknown').split('-').join(' ').split('_').join(' ');

const AdminDashboardHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: deliveryStats = [], isLoading } = useQuery({
    queryKey: ['delivery-status-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/delivery-status/stats');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  const chartData = deliveryStats.map(item => ({
    name: formatStatus(item.status),
    value: Number(item.count) || 0
  }));

  const totalParcels = deliveryStats.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  if (isLoading) return <PageLoader message="Loading admin dashboard..." />;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <DashboardHero
        eyebrow="Admin dashboard"
        title="Control the courier network."
        description="Monitor delivery health, approve riders, assign parcels, and keep the ZapShift operation moving smoothly."
        actions={[
          <Link key="approve" to="/dashboard/approve-riders" className="btn btn-primary rounded-full px-7 font-black text-secondary shadow-lg shadow-primary/30">Approve Riders</Link>,
          <Link key="assign" to="/dashboard/assign-riders" className="btn rounded-full border-white/20 bg-white/10 px-7 font-black text-white hover:bg-white/20">Assign Deliveries</Link>
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={<FaBoxOpen />} label="Total Parcels" value={totalParcels} note="All parcels grouped by delivery status." />
        <StatCard icon={<FaMotorcycle />} label="Rider Flow" value="Approval + assignment" note="Manage rider onboarding and parcel allocation." />
        <StatCard icon={<FaUsersGear />} label="Access Control" value="Role based" note="Separate customer, rider, and admin workflows." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Panel title="Delivery status" subtitle="Live parcel distribution by status.">
          <div className="space-y-3">
            {deliveryStats.length ? deliveryStats.map((stat, index) => (
              <div key={`${stat.status || 'unknown'}-${index}`} className="flex items-center justify-between rounded-2xl bg-[#f6faf4] p-4 transition hover:bg-primary/20">
                <div className="flex items-center gap-3">
                  <span className="size-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="font-black capitalize text-secondary">{formatStatus(stat.status)}</span>
                </div>
                <span className="rounded-full bg-secondary px-4 py-1 text-sm font-black text-white">{Number(stat.count) || 0}</span>
              </div>
            )) : <p className="rounded-2xl bg-[#f6faf4] p-5 text-sm font-semibold text-secondary/60">No delivery data yet.</p>}
          </div>
        </Panel>

        <Panel title="Courier chart" subtitle="A quick visual snapshot of parcel flow.">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={chartData} cx="50%" cy="50%" outerRadius={105} label>
                  {chartData.map((_, index) => <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Admin actions" subtitle="Common operations for managing courier movement.">
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/dashboard/approve-riders" className="rounded-3xl bg-secondary p-5 text-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/15">
            <FaMotorcycle className="text-3xl text-primary" />
            <h3 className="mt-4 text-xl font-black">Approve riders</h3>
            <p className="mt-2 text-sm font-semibold text-white/60">Review rider requests and activate delivery capacity.</p>
          </Link>
          <Link to="/dashboard/assign-riders" className="rounded-3xl bg-primary/30 p-5 text-secondary transition hover:-translate-y-1 hover:bg-primary">
            <FaRoute className="text-3xl" />
            <h3 className="mt-4 text-xl font-black">Assign deliveries</h3>
            <p className="mt-2 text-sm font-semibold text-secondary/60">Match pending parcels with available riders.</p>
          </Link>
          <Link to="/dashboard/users-management" className="rounded-3xl bg-secondary/5 p-5 text-secondary transition hover:-translate-y-1 hover:bg-secondary/10">
            <FaUsersGear className="text-3xl" />
            <h3 className="mt-4 text-xl font-black">Manage users</h3>
            <p className="mt-2 text-sm font-semibold text-secondary/60">Update roles and maintain access control.</p>
          </Link>
        </div>
      </Panel>
    </div>
  );
};

export default AdminDashboardHome;
