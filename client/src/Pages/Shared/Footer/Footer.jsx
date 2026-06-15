import React from 'react';
import Logo from '../../../Components/Logo';
import { Link } from 'react-router';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="mt-16 mb-8 overflow-hidden rounded-[2.25rem] bg-secondary text-white shadow-2xl shadow-secondary/20">
            <div className="relative p-8 md:p-10">
                <div className="absolute inset-0 opacity-20 courier-grid"></div>
                <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.8fr]">
                    <aside>
                        <Logo />
                        <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
                            ZapShift helps customers book parcels, pay online, track deliveries and manage courier operations from one clean platform.
                        </p>
                    </aside>
                    <nav>
                        <h4 className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">Quick links</h4>
                        <div className="grid gap-3 text-sm text-white/70">
                            <Link to="/sendparcel" className="hover:text-primary">Send Parcel</Link>
                            <Link to="/coverage" className="hover:text-primary">Coverage</Link>
                            <Link to="/rider" className="hover:text-primary">Become a Rider</Link>
                            <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
                        </div>
                    </nav>
                    <nav>
                        <h4 className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">Social</h4>
                        <div className="flex gap-3">
                            <a className="btn btn-circle border-white/10 bg-white/10 text-white hover:bg-primary hover:text-secondary"><FaFacebookF /></a>
                            <a className="btn btn-circle border-white/10 bg-white/10 text-white hover:bg-primary hover:text-secondary"><FaLinkedinIn /></a>
                            <a className="btn btn-circle border-white/10 bg-white/10 text-white hover:bg-primary hover:text-secondary"><FaGithub /></a>
                        </div>
                    </nav>
                </div>
                <div className="relative mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
                    <p>Copyright © {new Date().getFullYear()} ZapShift. All rights reserved.</p>
                    <p>Courier booking · tracking · rider operations</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
