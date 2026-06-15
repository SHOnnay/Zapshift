import React from 'react';
import { Link } from 'react-router';
import { FaArrowRight, FaBoxesStacked, FaClipboardCheck, FaLocationCrosshairs, FaMoneyCheckDollar, FaRoute, FaTruckFast } from 'react-icons/fa6';
import Banner from '../banner/Banner';
import OurServices from '../ourService/OurServices';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';

const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const workflowSteps = [
  {
    icon: FaClipboardCheck,
    title: 'Book the parcel',
    text: 'Create a delivery request with sender, receiver, parcel type and destination details.'
  },
  {
    icon: FaMoneyCheckDollar,
    title: 'Pay securely',
    text: 'Complete checkout and keep every payment connected to the parcel record.'
  },
  {
    icon: FaTruckFast,
    title: 'Assign rider',
    text: 'Admin assigns available riders based on district, status and delivery workload.'
  },
  {
    icon: FaLocationCrosshairs,
    title: 'Track progress',
    text: 'Every status update becomes part of the tracking timeline until delivery is complete.'
  }
];

const Home = () => {
  return (
    <div className="space-y-20 pb-10">
      <Banner />

      <section className="rounded-[2.25rem] border border-secondary/10 bg-white p-6 shadow-xl shadow-secondary/5 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-secondary/45">How ZapShift works</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-secondary md:text-5xl">
              One delivery flow from booking to doorstep.
            </h2>
            <p className="mt-5 leading-8 text-secondary/65">
              The home page should feel like a courier product, not a random carousel. So the flow is simple: book, pay, assign, track.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="group rounded-[1.75rem] border border-secondary/10 bg-[#f7fbef] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/20">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary shadow-lg shadow-secondary/10">
                      <Icon />
                    </div>
                    <span className="text-sm font-black text-secondary/25">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-black text-secondary">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-secondary/60">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <OurServices />

      <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-6 text-white shadow-2xl shadow-secondary/20 md:p-10">
        <div className="absolute inset-0 opacity-25 courier-grid"></div>
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-primary/25 blur-3xl"></div>
        <div className="relative grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">Courier control room</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Built for senders, riders and admins.</h2>
            <p className="mt-5 max-w-2xl leading-8 text-white/70">
              ZapShift is not only a landing page. It includes user parcel management, rider approval, parcel assignment, payment history and delivery status tracking.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              ['Sender dashboard', 'Create parcels, pay charges and monitor status.'],
              ['Admin dashboard', 'Approve riders, assign delivery work and manage users.'],
              ['Rider dashboard', 'View assigned deliveries and update parcel progress.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-lg font-black">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Reviews reviewsPromise={reviewsPromise} />
      <Brands />

      <section className="rounded-[2.5rem] border border-secondary/10 bg-white p-8 text-center shadow-xl shadow-secondary/5 md:p-12">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-3xl bg-primary text-2xl text-secondary shadow-lg shadow-primary/30">
            <FaBoxesStacked />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-secondary/45">Ready to move?</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-secondary md:text-5xl">Create your next delivery in minutes.</h2>
          <p className="mt-5 leading-8 text-secondary/65">
            Book a parcel, complete payment, and let ZapShift handle the delivery workflow from pickup to final status update.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/sendparcel" className="btn btn-primary rounded-full px-8 font-black text-secondary shadow-xl shadow-primary/30">
              Send Parcel <FaArrowRight />
            </Link>
            <Link to="/coverage" className="btn rounded-full border-secondary/10 bg-secondary px-8 font-bold text-white hover:bg-secondary/90">
              View Coverage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
