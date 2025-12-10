import React from 'react';
import service from '../../../../assets/service.png'

const ServiceCard = ({ title, description }) => (
    <div
        className='bg-white h-[340px] rounded-3xl w-full sm:w-[calc(33.333%-16px)] lg:w-[calc(30%-16px)] shadow-lg flex flex-col items-center p-6 gap-3 text-center hover:bg-primary transition duration-150' >
        <img src={service} alt="Service Icon" className="w-16 h-16 mb-2" />

        <p className='text-xl font-bold text-secondary'>
            {title}
        </p>

        <p className='text-[#606060] text-sm'>
            {description}
        </p>
    </div>
);

export default ServiceCard;