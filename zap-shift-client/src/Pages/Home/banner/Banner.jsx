import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import bannerimg1 from '../../../assets/banner/banner1.png'
import bannerimg2 from '../../../assets/banner/banner2.png'
import bannerimg3 from '../../../assets/banner/banner3.png'

const Banner = () => {
    const TrackButton = (
        <button
            className='bg-[#CAEB66] h-14 w-[220px] rounded-full font-bold text-xl absolute z-10 bottom-10 left-1/2 transform -translate-x-1/2'
            
            style={{
                position: 'absolute',
                zIndex: 10,
                bottom: '10%',
                left: '24%',
                transform: 'translateX(-50%)',
            }}
        >
            Track Your Parcel
        </button>
    );

    const slideContainerStyle = {
        position: 'relative', 
    };
    return (
        <>
            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} showStatus={false} interval={1500} >
                <div>
                    <img src={bannerimg1} />
                    {TrackButton}
                </div>
                <div>
                    <img src={bannerimg2} />
                </div>
                <div>
                    <img src={bannerimg3} />
                </div>
            </Carousel>

        </>

    );
};

export default Banner;