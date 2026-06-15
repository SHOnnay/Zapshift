import React from 'react';
import useRole from '../../../hooks/useRole';
import AdminDashboardHome from './AdminDashboardHome';
import RiderDashboardHome from './RiderDashboardHome';
import UserDashboardHome from './UserDashboardHome';

const DashboardHome = () => {

    const {role, roleLoading} = useRole();
    if(roleLoading){
        return <div className='flex items-center justify-center h-screen'>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    }
    if(role === 'admin'){
        return <AdminDashboardHome />
    }
    else if(role === 'rider'){
        return <RiderDashboardHome />
    }
    else if(role === 'user'){
        return <UserDashboardHome />
    }


    return (
        <div>
            <h2>dashing dashboard</h2>
        </div>
    );
};

export default DashboardHome;