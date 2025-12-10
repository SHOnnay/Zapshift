import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import amazon from '../../../assets/brands/amazon.png'
import casio from '../../../assets/brands/casio.png'
import moonstar from '../../../assets/brands/moonstar.png'
import randstad from '../../../assets/brands/randstad.png'
import star from '../../../assets/brands/star.png'
import star_people from '../../../assets/brands/start_people.png'

const brandLogos = [
    amazon,
    casio, moonstar,
    randstad,
    star,
    star_people
];

const Brands = () => {
    return (
        <Swiper
            modules={[Autoplay]}
            autoplay={{
                delay: 200,
                disableOnInteraction: false,
            }}

            loop={true}
            slidesPerView={4}
            centeredSlides={true}
            spaceBetween={30}
            grabCursor={true}>
            {
                brandLogos.map((logo, index) => (
                    <SwiperSlide key={index}>
                        <img src={logo} alt={`Brand ${index + 1}`} className="mt-20 h-10 mx-auto" />
                    </SwiperSlide>
                ))
            }
        </Swiper>
    );
};

export default Brands;