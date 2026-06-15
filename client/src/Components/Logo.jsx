import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router';

const Logo = () => {
    return (
        <Link to="/" className="group inline-flex items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary shadow-lg shadow-secondary/20 ring-1 ring-secondary/10 transition group-hover:-rotate-3 group-hover:scale-105">
                <img src={logo} alt="ZapShift logo" className="w-8" />
            </div>
            <div className="leading-none">
                <h3 className="text-2xl font-black tracking-tight text-secondary">ZapShift</h3>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-secondary/45">Courier Network</p>
            </div>
        </Link>
    );
};

export default Logo;
