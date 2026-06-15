import React from 'react';

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="group rounded-[1.75rem] border border-white/10 bg-white/[0.08] p-6 text-left backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:bg-white/[0.13]">
    <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-xl text-secondary shadow-lg shadow-primary/20 transition group-hover:rotate-3 group-hover:scale-105">
      <Icon />
    </div>
    <p className="text-xl font-black text-white">{title}</p>
    <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
  </div>
);

export default ServiceCard;
