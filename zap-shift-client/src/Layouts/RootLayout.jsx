import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from '../Pages/Shared/Footer/Footer';
import Navbar from '../Pages/Shared/Navbar/Navbar';

const RootLayout = () => {
    const location = useLocation();

    return (
        <div className="max-w-7xl mx-auto">
            <Navbar />
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

            <Footer />
        </div>
    );
};

export default RootLayout;