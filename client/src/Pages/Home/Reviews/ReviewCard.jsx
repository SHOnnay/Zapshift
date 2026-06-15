import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const roles = ['Merchant sender', 'Parcel customer', 'Delivery partner'];

const ReviewCard = ({ review, index = 0 }) => {
  const { userName, review: testimonial, user_photoURL } = review;

  return (
    <article className="group rounded-[1.75rem] border border-secondary/10 bg-[#f7fbef] p-5 transition duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary/20">
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <FaQuoteLeft />
        </div>
        <div className="min-w-0 flex-1">
          <p className="leading-7 text-secondary/70">{testimonial}</p>
          <div className="mt-5 flex items-center gap-3 border-t border-secondary/10 pt-4">
            <img src={user_photoURL} alt={userName} className="size-11 rounded-2xl object-cover ring-2 ring-white" />
            <div>
              <h3 className="font-black text-secondary">{userName}</h3>
              <p className="text-sm font-semibold text-secondary/45">{roles[index % roles.length]}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
