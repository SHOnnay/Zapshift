import React from 'react';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png';
import Logo from '../Components/Logo';

const AuthLayout = () => {
    return (
        <div className='max-w-7xl mx-auto mt-10'>
            <Logo></Logo>
            <div className='flex'>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <img src={authImage} alt="" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;