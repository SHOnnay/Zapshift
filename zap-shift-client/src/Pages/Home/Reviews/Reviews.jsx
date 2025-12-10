import React, { use } from 'react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviewsPromise }) => {
    const reviews = use(reviewsPromise);
    console.log(reviews)
    return (
        <div className='my-24'>
            <div className='text-center mb-24'>
                <h3 className='text-3xl text-center font-bold my-8'>review</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto ipsam nemo natus quaerat, aliquam dolorem amet est laborum maxime libero fugit hic autem expedita itaque? Magni nisi velit vitae odit?</p>
            </div>
                <Swiper
                loop={true}
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={3}
                    coverflowEffect={{
                        rotate: 30,
                        stretch: '50%',
                        depth: 200,
                        scale: 0.75,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    pagination={true}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className="mySwiper"
                >
                    {
                        reviews.map((review, index) => (
                            <SwiperSlide key={index}>
                                <ReviewCard review={review}></ReviewCard>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
        </div>
    );
};

export default Reviews;