import React from 'react';

const Cards = ({ children, title, description }) => {
    return (
        <section className="my-20">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary p-6 text-white shadow-2xl shadow-secondary/20 md:p-10">
                <div className="absolute inset-0 opacity-25 courier-grid"></div>
                <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl"></div>
                <div className="relative">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-black uppercase tracking-[0.28em] text-primary">Courier services</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
                        <p className="mt-5 text-white/70">{description}</p>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cards;
