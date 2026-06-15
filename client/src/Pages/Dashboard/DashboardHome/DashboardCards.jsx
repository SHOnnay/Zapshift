import React from 'react';

export const DashboardHero = ({ eyebrow, title, description, actions = [], children }) => (
  <section className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-6 text-white shadow-2xl shadow-secondary/15 md:p-9">
    <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute bottom-0 left-0 h-2 w-full route-line opacity-70" />
    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/65">{description}</p>
        {!!actions.length && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
      </div>
      <div className="relative min-h-52 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
        <div className="absolute left-6 right-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/15" />
        <div className="absolute left-6 right-6 top-1/2 h-1 w-2/3 -translate-y-1/2 rounded-full bg-primary" />
        <div className="relative flex h-full min-h-44 items-center justify-between">
          <div className="grid size-16 place-items-center rounded-3xl bg-primary text-3xl shadow-xl shadow-primary/30">📦</div>
          <div className="grid size-20 place-items-center rounded-full border-4 border-primary bg-secondary text-4xl shadow-2xl">🚚</div>
          <div className="grid size-16 place-items-center rounded-3xl bg-white text-3xl text-secondary">🏠</div>
        </div>
        {children}
      </div>
    </div>
  </section>
);

export const StatCard = ({ icon, label, value, note }) => (
  <div className="group rounded-[2rem] border border-secondary/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10">
    <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary/30 text-3xl text-secondary transition group-hover:bg-primary">{icon}</div>
    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary/40">{label}</p>
    <h3 className="mt-2 text-2xl font-black leading-tight text-secondary md:text-3xl">{value}</h3>
    {note && <p className="mt-2 text-sm font-semibold text-secondary/55">{note}</p>}
  </div>
);

export const Panel = ({ title, subtitle, children }) => (
  <div className="rounded-[2rem] border border-secondary/10 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black text-secondary">{title}</h2>
        {subtitle && <p className="mt-1 text-sm font-semibold text-secondary/50">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);
