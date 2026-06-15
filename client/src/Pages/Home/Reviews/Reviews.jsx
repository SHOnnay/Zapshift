import React, { use } from 'react';
import { Autoplay, EffectCards, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);
    
    return (
        <div className='my-24'>
            <div className='text-center mb-24'>
                <h3 className='text-3xl text-center text-secondary font-bold my-8'>What our customers are saying</h3>
                <p>Trusted delivery experiences from merchants, customers, and riders using ZapShift every day.</p>
            </div>
            <Swiper
                loop={true}
                centeredSlides={true}
                slidesPerView={1.2}
                spaceBetween={40}
                speed={800}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                    768: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3 },
                }}
                modules={[Pagination, Autoplay]}
                className="py-20"
            >
                {reviews.map((review, index) => (
                    <SwiperSlide key={index}>
                        <div className="review-slide">
                            <ReviewCard review={review} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Reviews;