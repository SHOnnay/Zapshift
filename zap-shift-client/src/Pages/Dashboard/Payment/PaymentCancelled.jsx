import React from 'react';
import { Link } from 'react-router';


const PaymentCancelled = () => {
    return (
        <div>
            <h2>Payment Canceled!</h2>
            <Link to="/dashboard/my-parcels"><button className='btn btn-primary'>Try again</button></Link>
        </div>
    );
};

export default PaymentCancelled;