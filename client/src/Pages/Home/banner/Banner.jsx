import React from 'react';
import { Link } from 'react-router';
import {
  FaArrowRight,
  FaBoxOpen,
  FaCircleCheck,
  FaClock,
  FaLocationDot,
  FaRoute,
  FaTruckFast,
} from 'react-icons/fa6';
import bannerimg1 from '../../../assets/banner/banner1.png';
import deliveryVan from '../../../assets/delivery-van.png';

const Banner = () => {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary px-6 py-10 text-white shadow-2xl shadow-secondary/20 md:px-10 md:py-14 lg:px-14 lg:py-16">
      <div className="absolute inset-0 opacity-35 courier-grid"></div>
      <div className="absolute -left-24 top-16 size-72 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -right-20 -top-20 size-96 rounded-full bg-primary/25 blur-3xl"></div>
      <div className="absolute bottom-16 left-0 right-0 h-1 route-line opacity-60"></div>

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-extrabold backdrop-blur">
            <FaTruckFast className="text-primary" /> Smart courier platform for Bangladesh
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
            Send parcels faster. Track every move.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            ZapShift brings parcel booking, secure checkout, rider assignment and live tracking into one clean delivery experience for customers, merchants and admins.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/sendparcel" className="btn btn-primary rounded-full px-8 font-black text-secondary shadow-xl shadow-primary/30">
              Send a Parcel <FaArrowRight />
            </Link>
            <Link to="/coverage" className="btn rounded-full border-white/20 bg-white/10 px-8 font-bold text-white hover:bg-white/20">
              Check Coverage
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <FaLocationDot className="mb-3 text-2xl text-primary" />
              <p className="text-2xl font-black">64+</p>
              <p className="text-sm text-white/65">District coverage</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <FaClock className="mb-3 text-2xl text-primary" />
              <p className="text-2xl font-black">24/7</p>
              <p className="text-sm text-white/65">Status visibility</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <FaCircleCheck className="mb-3 text-2xl text-primary" />
              <p className="text-2xl font-black">Secure</p>
              <p className="text-sm text-white/65">Payments & records</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-5 top-10 z-10 hidden rounded-3xl bg-white p-4 text-secondary shadow-2xl md:block">
            <p className="text-xs font-black uppercase tracking-widest text-secondary/45">Pickup created</p>
            <p className="font-black">Mirpur → Dhanmondi</p>
          </div>

          <div className="absolute -right-4 bottom-28 z-10 hidden rounded-3xl border border-white/10 bg-secondary/95 p-4 text-white shadow-2xl md:block">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Tracking</p>
            <p className="font-black">Rider assigned</p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur truck-card-shadow">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#e9f6d3] p-4">
              <img src={bannerimg1} alt="ZapShift delivery app" className="w-full rounded-[1.25rem] object-cover" />
              <img src={deliveryVan} alt="Delivery van" className="absolute bottom-3 right-4 w-28 drop-shadow-xl md:w-36" />
            </div>
          </div>

          <div className="absolute -bottom-7 left-5 right-5 rounded-3xl border border-slate-100 bg-white p-5 text-secondary shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/55">
                <FaBoxOpen className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-secondary/50">Live parcel status</p>
                <p className="truncate text-xl font-black">On the way to receiver</p>
              </div>
              <FaRoute className="text-2xl text-secondary/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
