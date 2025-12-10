import React from 'react';

const Cards = ({ children, title, description }) => {
    return (
        <section className="service-section">
            <div className='bg-[#03373D] rounded-2xl flex flex-col items-center justify-center mx-auto p-8 mt-20'>

                <p className='text-white font-bold mt-10 text-3xl text-center'>
                    {title}
                </p>

                <p className='text-white mt-5 mb-10 text-center w-3/4'>
                    {description}
                </p>

                <div className='flex flex-wrap justify-center gap-6 w-full max-w-6xl p-4'>
                    {children}
                </div>
            </div>
        </section>
    );
};

export default Cards;