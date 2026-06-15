import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';
import PageLoader from '../../../Components/State/PageLoader';

const DashboardHome = () => {
  const { role, roleLoading } = useRole();

  if (roleLoading) return <PageLoader message="Preparing your courier dashboard..." />;

  if (role === 'admin') return <AdminDashboardHome />;
  if (role === 'rider') return <RiderDashboardHome />;

  return <UserDashboardHome />;
};

export default DashboardHome;
