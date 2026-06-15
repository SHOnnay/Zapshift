import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
    const { userName, review: testimonial, user_photoURL } = review;
    return (
        <div className="w-full max-w-md p-6 rounded-2xl shadow-lg bg-base-100 border border-gray-200">
            <FaQuoteLeft className="text-3xl text-primary mb-4" />

            <p className="text-gray-600 leading-relaxed mb-4">
                {testimonial}
            </p>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary">
                    <img src={user_photoURL} alt="" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{userName}</h3>
                    <p className="text-sm text-gray-500">Senior Product Designer</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;