import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../Components/Logo';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import { FaBoxOpen, FaCreditCard, FaHouse, FaMotorcycle, FaRoute, FaUsersGear } from 'react-icons/fa6';
import { FaTasks } from 'react-icons/fa';
import { SiGoogletasks } from 'react-icons/si';

const baseLink = 'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-secondary/70 transition hover:bg-primary/20 hover:text-secondary';
const activeLink = 'bg-secondary text-white shadow-lg shadow-secondary/10 hover:bg-secondary hover:text-white';

const DashboardLayout = () => {
  const { role } = useRole();
  const { user } = useAuth();

  const navClass = ({ isActive }) => `${baseLink} ${isActive ? activeLink : ''}`;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-[#f6faf4] courier-grid">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col">
        <nav className="sticky top-0 z-30 border-b border-secondary/10 bg-white/85 backdrop-blur-2xl">
          <div className="flex min-h-20 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-3">
              <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost rounded-2xl text-secondary lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </label>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">ZapShift Console</p>
                <h1 className="text-xl font-black text-secondary md:text-2xl">Courier Operations Dashboard</h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-secondary/10 bg-secondary/5 px-4 py-2 md:flex">
              <div className="avatar placeholder">
                <div className="w-9 rounded-full bg-secondary text-white">
                  <span className="text-xs font-black">{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                </div>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-black text-secondary">{user?.displayName || 'ZapShift User'}</p>
                <p className="text-xs font-bold capitalize text-secondary/50">{role || 'user'} account</p>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="flex min-h-full w-80 flex-col border-r border-secondary/10 bg-white/95 p-4 backdrop-blur-2xl">
          <div className="mb-6 rounded-[2rem] bg-[#f6faf4] p-4">
            <Logo />
          </div>

          <div className="mb-5 rounded-[1.75rem] bg-secondary p-5 text-white shadow-xl shadow-secondary/15">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Live Network</p>
            <h2 className="mt-2 text-2xl font-black">Move parcels with confidence.</h2>
            <p className="mt-2 text-sm font-semibold text-white/60">Bookings, payments, riders, and delivery status in one courier workspace.</p>
          </div>

          <ul className="menu grow gap-1 p-0">
            <li>
              <NavLink to="/dashboard" end className={navClass}>
                <FaHouse className="text-lg" />
                <span>Overview</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/my-parcels" className={navClass}>
                <FaBoxOpen className="text-lg" />
                <span>My Parcels</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/payment-history" className={navClass}>
                <FaCreditCard className="text-lg" />
                <span>Payment History</span>
              </NavLink>
            </li>

            {role === 'rider' && (
              <>
                <li className="mt-3 px-4 text-[10px] font-black uppercase tracking-[0.24em] text-secondary/35">Rider Tools</li>
                <li>
                  <NavLink to="/dashboard/assigned-deliveries" className={navClass}>
                    <FaTasks className="text-lg" />
                    <span>Assigned Deliveries</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/completed-deliveries" className={navClass}>
                    <SiGoogletasks className="text-lg" />
                    <span>Completed Deliveries</span>
                  </NavLink>
                </li>
              </>
            )}

            {role === 'admin' && (
              <>
                <li className="mt-3 px-4 text-[10px] font-black uppercase tracking-[0.24em] text-secondary/35">Admin Tools</li>
                <li>
                  <NavLink to="/dashboard/approve-riders" className={navClass}>
                    <FaMotorcycle className="text-lg" />
                    <span>Approve Riders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/assign-riders" className={navClass}>
                    <FaRoute className="text-lg" />
                    <span>Assign Riders</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/users-management" className={navClass}>
                    <FaUsersGear className="text-lg" />
                    <span>Users Management</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="mt-5 rounded-[1.5rem] border border-secondary/10 bg-primary/20 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary/50">Quick action</p>
            <Link to="/sendparcel" className="btn btn-primary mt-3 w-full rounded-full font-black text-secondary shadow-lg shadow-primary/30">
              Book New Delivery
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
