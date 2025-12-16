import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import authImage from '../assets/authImage.png';
import Logo from '../Components/Logo';

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className='max-w-7xl mx-auto mt-10'>
      <Logo />

      <div className='flex items-center gap-10 mt-10 mx-auto'>
        <div className='flex-1'>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}  
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='flex-1'>
          <img src={authImage} alt="Auth" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;