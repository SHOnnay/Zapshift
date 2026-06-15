import React from 'react';
import amazon from '../../../assets/brands/amazon.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import star from '../../../assets/brands/star.png';
import star_people from '../../../assets/brands/start_people.png';

const brandLogos = [amazon, casio, moonstar, randstad, star, star_people];

const Brands = () => {
  return (
    <section className="rounded-[2rem] border border-secondary/10 bg-white px-5 py-8 shadow-xl shadow-secondary/5">
      <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.28em] text-secondary/45">
        Suitable for merchants, local businesses and everyday senders
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {brandLogos.map((logo, index) => (
          <div key={index} className="flex h-16 items-center justify-center rounded-2xl border border-secondary/10 bg-[#f7fbef] px-5 transition hover:-translate-y-1 hover:border-primary hover:bg-primary/20">
            <img src={logo} alt={`Brand ${index + 1}`} className="max-h-8 object-contain opacity-55 grayscale transition hover:opacity-100 hover:grayscale-0" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brands;
