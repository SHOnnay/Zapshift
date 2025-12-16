import React from 'react';
import { useForm } from 'react-hook-form';

const SendParcel = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const hadnleSendParcel = data => {
        console.log(data);
    }

    return (
        <div>
            <h2 className='text-5xl font-bold text-secondary'>Send a Parcel</h2>
            <form onSubmit={handleSubmit(hadnleSendParcel)} className='mt-12 p-4 text-black'>
                {/* parcel type*/}
                <div>
                    <label className="label mr-4">
                        <input type="radio" {...register("parcelType")} value="document" className="radio" defaultChecked />Document
                    </label>
                    <label className="label">
                        <input type="radio" {...register("parcelType")} value="non-document" className="radio" />Non-Document
                    </label>
                </div>

                {/* parcel info name, wight */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 my-8'>
                    <fieldset className="fieldset">
                        <label className="label">Parcel Name</label>
                        <input type="text" {...register("parcelName")} className="input w-full" placeholder="Parcel Name" />
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="label">Parcel Weight</label>
                        <input type="number" {...register("parcelWeight")} className="input w-full" placeholder="Parcel Weight" />
                    </fieldset>
                </div>

                {/* two column layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    {/* sender info */}
                    
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">Sender Details</h4>
                        <label className="label font-bold">Sender Name</label>
                        <input type="text" {...register("senderName")} className="input w-full" placeholder="Sender Name" />
                        {/* sender address */}
                        <label className="label  mt-4 font-bold">Sender Address</label>
                        <input type="text" {...register("senderAddress")} className="input w-full" placeholder="Sender Address" />
                        {/* sender phone */}
                        <label className="label font-bold  mt-4">Sender Phone No</label>
                        <input type="text" {...register("senderPhoneNo")} className="input w-full" placeholder="Sender Phone No" />
                        {/* sender district */}
                        <label className="label  mt-4 font-bold">Sender District</label>
                        <input type="text" {...register("senderDistrict")} className="input w-full" placeholder="Sender District" />
                        {/* sender instructions */}
                        <label className="label  mt-4 font-bold">Sender Instructions</label>
                        <textarea {...register("senderInstructions")} className="textarea w-full" placeholder="Sender Instructions"></textarea>
                    </fieldset>
                    {/* receiver details */}
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">Receiver Details</h4>
                        <label className="label font-bold">Receiver Name</label>
                        <input type="text" {...register("recieverName")} className="input w-full" placeholder="Receiver Name" />
                        {/* receiver address */}
                        <label className="label font-bold  mt-4">Receiver Address</label>
                        <input type="text" {...register("receiverAddress")} className="input w-full" placeholder="Receiver Address" />
                        {/* receiver phone */}
                        <label className="label  mt-4 font-bold">Receiver Phone No</label>
                        <input type="text" {...register("receiverPhoneNo")} className="input w-full" placeholder="Receiver Phone No" />
                        {/* receiver district */}
                        <label className="label  mt-4 font-bold">Receiver District</label>
                        <input type="text" {...register("receiverDistrict")} className="input w-full" placeholder="Receiver District" />
                        {/* delivery instructions */}
                        <label className="label  mt-4 font-bold">Delivery Instructions</label>
                        <textarea {...register("deliveryInstructions")} className="textarea w-full" placeholder="Delivery Instructions"></textarea>
                    </fieldset>
                </div>
                <input type="submit" className='btn btn-primary text-black mt-4' value="Send Parcel" />
            </form>
        </div>
    );
};

export default SendParcel;