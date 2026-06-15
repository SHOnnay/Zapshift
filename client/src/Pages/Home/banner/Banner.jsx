import React from 'react';
import { Link } from 'react-router';
import { FaArrowRight, FaLocationDot, FaShieldHeart, FaTruckFast } from 'react-icons/fa6';
import bannerimg1 from '../../../assets/banner/banner1.png';

const Banner = () => {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-6 text-white shadow-2xl md:p-10 lg:p-14">
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 size-60 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                        <FaTruckFast className="text-primary" /> Fast parcel delivery across Bangladesh
                    </div>
                    <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                        Ship parcels faster with real-time tracking and secure checkout.
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
                        ZapShift helps customers book deliveries, pay online, track parcels, and manage delivery operations from one clean dashboard.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link to="/sendparcel" className="btn btn-primary rounded-full px-8 text-secondary">
                            Send Parcel <FaArrowRight />
                        </Link>
                        <Link to="/coverage" className="btn rounded-full border-white/20 bg-white/10 px-8 text-white hover:bg-white/20">
                            Check Coverage
                        </Link>
                    </div>
                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <FaLocationDot className="mb-3 text-2xl text-primary" />
                            <p className="text-2xl font-black">64+</p>
                            <p className="text-sm text-white/65">District support</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <FaTruckFast className="mb-3 text-2xl text-primary" />
                            <p className="text-2xl font-black">24–72h</p>
                            <p className="text-sm text-white/65">Delivery window</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <FaShieldHeart className="mb-3 text-2xl text-primary" />
                            <p className="text-2xl font-black">Secure</p>
                            <p className="text-sm text-white/65">Payments & tracking</p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                        <img src={bannerimg1} alt="ZapShift delivery service" className="w-full rounded-[1.5rem] object-cover" />
                    </div>
                    <div className="absolute -bottom-6 left-6 rounded-3xl bg-base-100 p-5 text-secondary shadow-2xl">
                        <p className="text-sm font-bold text-base-content/50">Live status</p>
                        <p className="text-xl font-black">Parcel on the way</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
