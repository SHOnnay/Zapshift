import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '../Pages/Shared/Footer/Footer';
import Navbar from '../Pages/Shared/Navbar/Navbar';

const MotionMain = motion.main;

const RootLayout = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(202,235,102,0.22),transparent_28%),linear-gradient(180deg,#f7faf8_0%,#eef4ef_45%,#ffffff_100%)] px-3 text-base-content sm:px-5">
            <div className="mx-auto max-w-7xl pt-4">
                <Navbar />
                <AnimatePresence mode="wait">
                    <MotionMain
                        key={location.pathname}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Outlet />
                    </MotionMain>
                </AnimatePresence>
                <Footer />
            </div>
        </div>
    );
};

export default RootLayout;
