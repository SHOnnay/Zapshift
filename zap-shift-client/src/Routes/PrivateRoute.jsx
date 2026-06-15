import React, { use } from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children }) => {

    const {user, loading} =useAuth();
    const location = useLocation();

    if(loading){
        return <div><span className="loading loading-infinity loading-xl"></span></div>;
    }

    if(!user){
        return <Navigate to='/login' state={{from: location}} replace></Navigate>
    }

    return children;
};

export default PrivateRoute;