import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { FaBoxOpen, FaMotorcycle, FaUsersGear } from 'react-icons/fa6';
import { Link } from 'react-router';
import PageLoader from '../../../Components/State/PageLoader';

const CHART_COLORS = ['#03373D', '#CAEB66', '#38BDF8', '#FB7185', '#A78BFA', '#F59E0B'];

const formatStatus = (status = '') => status.split('-').join(' ').split('_').join(' ');

const AdminDashboardHome = () => {
    const axiosSecure = useAxiosSecure();

    const { data: deliveryStats = [], isLoading } = useQuery({
        queryKey: ['delivery-status-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery-status/stats');
            return res.data;
        }
    });

    const chartData = deliveryStats.map(item => ({
        name: formatStatus(item.status),
        value: item.count
    }));

    const totalParcels = deliveryStats.reduce((sum, item) => sum + item.count, 0);

    if (isLoading) return <PageLoader message="Loading admin dashboard..." />;

    return (
        <div className="p-4 md:p-8">
            <section className="rounded-[2rem] bg-secondary p-8 text-white shadow-xl">
                <p className="font-bold uppercase tracking-[0.25em] text-primary">Admin Dashboard</p>
                <h1 className="mt-3 text-4xl font-black">Control center for ZapShift operations</h1>
                <p className="mt-3 max-w-2xl text-white/70">Review delivery health, approve riders, assign parcels, and manage platform users.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/dashboard/approve-riders" className="btn btn-primary rounded-full text-secondary">Approve Riders</Link>
                    <Link to="/dashboard/assign-riders" className="btn rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20">Assign Deliveries</Link>
                </div>
            </section>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaBoxOpen className="mb-4 text-3xl text-primary" /><p className="text-sm font-bold uppercase text-base-content/50">Total Parcels</p><h3 className="text-4xl font-black text-secondary">{totalParcels}</h3></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaMotorcycle className="mb-4 text-3xl text-primary" /><p className="text-sm font-bold uppercase text-base-content/50">Rider Flow</p><h3 className="text-2xl font-black text-secondary">Approval + Assignment</h3></div>
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm"><FaUsersGear className="mb-4 text-3xl text-primary" /><p className="text-sm font-bold uppercase text-base-content/50">Access Control</p><h3 className="text-2xl font-black text-secondary">Role-based Dashboard</h3></div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-secondary">Delivery Status</h2>
                    <div className="mt-4 space-y-3">
                        {deliveryStats.length ? deliveryStats.map((stat) => (
                            <div key={stat.status} className="flex items-center justify-between rounded-2xl bg-base-200 p-4">
                                <span className="font-bold capitalize text-secondary">{formatStatus(stat.status)}</span>
                                <span className="badge badge-primary badge-lg text-secondary">{stat.count}</span>
                            </div>
                        )) : <p className="text-base-content/60">No delivery data yet.</p>}
                    </div>
                </div>

                <div className="rounded-3xl bg-base-100 p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-secondary">Status Chart</h2>
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;
