import React, { use } from 'react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <section className="rounded-[2.5rem] border border-secondary/10 bg-white p-6 shadow-xl shadow-secondary/5 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-secondary/45">Customer trust</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-secondary md:text-5xl">
            Delivery should feel clear, not confusing.
          </h2>
          <p className="mt-5 leading-8 text-secondary/65">
            I removed the carousel because it was making the homepage feel like a template. These testimonials now work like proof cards: easy to scan, stable, and clean.
          </p>
        </div>

        <div className="grid gap-4">
          {featuredReviews.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
