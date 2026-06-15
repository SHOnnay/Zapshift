import React from 'react';
import Cards from './Cards/Cards';
import ServiceCard from './ServiceCards/ServiceCard';
import { FaBuildingShield, FaBoxesPacking, FaCreditCard, FaRotateLeft, FaTruckFast, FaWarehouse } from 'react-icons/fa6';

const cardData = [
  {
    icon: FaTruckFast,
    title: 'Fast City Delivery',
    description: 'Book parcels for same-city movement with clear pricing, payment status and delivery progress.'
  },
  {
    icon: FaBuildingShield,
    title: 'Nationwide Coverage',
    description: 'Serve customers across districts with a delivery workflow designed for Bangladesh.'
  },
  {
    icon: FaBoxesPacking,
    title: 'Merchant Parcel Flow',
    description: 'Manage regular shipments with sender details, receiver information and parcel history.'
  },
  {
    icon: FaCreditCard,
    title: 'Secure Checkout',
    description: 'Connect every parcel payment with the order, tracking ID and payment history.'
  },
  {
    icon: FaWarehouse,
    title: 'Admin Operations',
    description: 'Approve riders, assign parcels and monitor delivery status from one dashboard.'
  },
  {
    icon: FaRotateLeft,
    title: 'Return Ready',
    description: 'Keep the structure flexible for failed deliveries, returns and future merchant workflows.'
  }
];

const OurServices = () => {
  return (
    <Cards title="Courier services that feel connected" description="Instead of disconnected pages, ZapShift keeps booking, payment, rider assignment and tracking inside one delivery system.">
      {cardData.map((card, index) => (
        <ServiceCard key={index} icon={card.icon} title={card.title} description={card.description} />
      ))}
    </Cards>
  );
};

export default OurServices;
