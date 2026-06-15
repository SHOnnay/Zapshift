import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import authImage from '../assets/authImage.png';
import Logo from '../Components/Logo';
import { FaBoxOpen, FaRoute, FaTruckFast } from 'react-icons/fa6';

const MotionDiv = motion.div;

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen courier-grid bg-[radial-gradient(circle_at_top_left,rgba(202,235,102,0.35),transparent_28%),linear-gradient(180deg,#f8fbf4,#edf6ea)] px-5 py-6">
      <div className="mx-auto max-w-7xl">
        <Logo />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <AnimatePresence mode="wait">
              <MotionDiv
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Outlet />
              </MotionDiv>
            </AnimatePresence>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-8 top-10 rounded-3xl bg-white p-5 text-secondary shadow-2xl">
              <FaTruckFast className="mb-3 text-2xl text-primary" />
              <p className="text-sm font-black">Fast booking</p>
              <p className="text-xs text-secondary/55">Send parcel in minutes</p>
            </div>
            <div className="overflow-hidden rounded-[2.5rem] bg-secondary p-8 text-white shadow-2xl shadow-secondary/20">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">Welcome to ZapShift</p>
                  <h1 className="mt-4 text-5xl font-black leading-none tracking-tight">Courier control made simple.</h1>
                  <div className="mt-8 grid gap-4">
                    <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4">
                      <FaBoxOpen className="text-primary" /> Book parcels securely
                    </div>
                    <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4">
                      <FaRoute className="text-primary" /> Track delivery progress
                    </div>
                    <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4">
                      <FaTruckFast className="text-primary" /> Manage rider operations
                    </div>
                  </div>
                </div>
                <img src={authImage} alt="Courier authentication" className="mx-auto max-h-[440px] object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
