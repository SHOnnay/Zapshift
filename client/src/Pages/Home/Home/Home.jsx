import React from 'react';
import Banner from '../banner/Banner';
import OurServices from '../ourService/OurServices';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';


const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {

    return (
        <div>
            <Banner></Banner>
            <Brands></Brands>
            <Reviews  reviewsPromise={reviewsPromise}></Reviews>
            <OurServices></OurServices>
        </div>
    );
};

export default Home;