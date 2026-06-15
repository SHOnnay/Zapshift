import React from 'react';
import Logo from '../../../Components/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
    const { user, logOutUser } = useAuth();

    const handleLogOut = () => {
        logOutUser().catch((error) => {
            console.error(error.message);
        });
    };

    const navItemStyle = ({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-bold transition ${isActive
            ? 'bg-secondary text-white shadow-sm'
            : 'text-secondary/80 hover:bg-secondary/10 hover:text-secondary'
        }`;

    const links = <>
        <li><NavLink to="/" className={navItemStyle}>Home</NavLink></li>
        <li><NavLink to="/sendparcel" className={navItemStyle}>Send Parcel</NavLink></li>
        <li><NavLink to="/coverage" className={navItemStyle}>Coverage</NavLink></li>
        <li><NavLink to="/rider" className={navItemStyle}>Be a Rider</NavLink></li>
        {user && <li><NavLink to="/dashboard" className={navItemStyle}>Dashboard</NavLink></li>}
        <li><NavLink to="/aboutus" className={navItemStyle}>About</NavLink></li>
    </>;

    return (
        <div className="sticky top-4 z-50 mb-8 rounded-3xl border border-base-300/70 bg-base-100/90 px-2 shadow-xl backdrop-blur-xl">
            <div className="navbar min-h-20">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" aria-label="Open navigation menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex="-1" className="menu dropdown-content z-50 mt-3 w-56 rounded-2xl bg-base-100 p-3 shadow-2xl">
                            {links}
                        </ul>
                    </div>
                    <Logo />
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1 px-1">{links}</ul>
                </div>
                <div className="navbar-end gap-2">
                    {user ? (
                        <button onClick={handleLogOut} className="btn btn-ghost rounded-full">Log Out</button>
                    ) : (
                        <Link to="/login" className="btn btn-ghost rounded-full">Login</Link>
                    )}
                    <Link to="/sendparcel" className="btn btn-primary hidden rounded-full px-6 text-secondary sm:inline-flex">Book Now</Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
