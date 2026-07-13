import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const SendParcel = () => {

    const {
        register,
        handleSubmit,
        control
    } = useForm();

    const { user } = useAuth();

    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const serviceCenters = useLoaderData();

    const regionsDuplicate = serviceCenters.map(center => center.region);
    const regions = [...new Set(regionsDuplicate)];
    //explore useMemo for regions
    const senderRegion = useWatch({
        control,
        name: "senderRegion"
    });
    const receiverRegion = useWatch({
        control,
        name: "receiverRegion"
    });

    const districtByRegion = (region) => {
        const regionDistricts = serviceCenters.filter(center => center.region === region);
        const districts = regionDistricts.map(center => center.district);
        return districts;
    };

    const hadnleSendParcel = (data) => {
        const isDocument = data.parcelType === "document";
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = Number(data.parcelWeight);

        let cost = 0;

        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        } else {
            if (parcelWeight <= 3) {
                cost = isSameDistrict ? 110 : 150;
            } else {
                const minCharge = isSameDistrict ? 110 : 150;
                const extraWeight = Math.ceil(parcelWeight - 3);
                const extraCharge = extraWeight * 40;

                cost = minCharge + extraCharge;
            }
        }

        data.cost = cost;

        Swal.fire({
            title: "Proceed with the Cost?",
            html: `You will be charged <strong>${cost} TK</strong> for this parcel delivery.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "<strong>Yes, Proceed!</strong>",
        }).then((result) => {
            if (result.isConfirmed) {

                //save to the database
                axiosSecure.post('/parcels', { ...data })
                    .then(res => {
                        if (res.data.insertedId) {
                            navigate('/dashboard/my-parcels');
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Parcel booked successfully! Proceed to payment.",
                                showConfirmButton: false,
                                timer: 2500
                            });
                        }
                    });
            }
        });
    };


    return (
        <div>
            <h2 className='text-5xl font-bold text-secondary px-4'>Send a Parcel</h2>
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
                        <label className="label font-black">Parcel Name</label>
                        <input type="text" {...register("parcelName")} className="input w-full" placeholder="Parcel Name" />
                    </fieldset>

                    <fieldset className="fieldset">
                        <label className="label font-black">Parcel Weight</label>
                        <input type="number" {...register("parcelWeight")} className="input w-full" placeholder="Parcel Weight" />
                    </fieldset>
                </div>

                {/* two column layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    {/* sender info */}

                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">Sender Details</h4>

                        {/* sender name */}
                        <label className="label font-bold">Sender Name</label>
                        <input type="text" {...register("senderName")}
                            defaultValue={user?.displayName}
                            className="input w-full" placeholder="Sender Name" />

                        {/* sender email */}
                        <label className="label font-bold">Sender Email</label>
                        <input type="email" {...register("senderEmail")}
                            defaultValue={user?.email}
                            className="input w-full" placeholder="Sender Email" />

                        {/* sender address */}
                        <label className="label  font-bold">Sender Address</label>
                        <input type="text" {...register("senderAddress")} className="input w-full" placeholder="Sender Address" />

                        {/* sender phone */}
                        <label className="label font-bold">Sender Phone No</label>
                        <input type="text" {...register("senderPhoneNo")} className="input w-full" placeholder="Sender Phone No" />


                        {/* sender region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender Region</legend>
                            <select {...register("senderRegion")} defaultValue="Select Region" className="select w-full">
                                <option value="disabled" >Select a Region</option>
                                {
                                    regions.map((region, index) => <option key={index} value={region}>{region}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* sender district */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender District</legend>
                            <select {...register("senderDistrict")} defaultValue="Select District" className="select w-full">
                                <option value="disabled">Select a District</option>
                                {
                                    districtByRegion(senderRegion)?.map((district, index) => <option key={index} value={district}>{district}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* sender instructions */}
                        <label className="label font-black">Sender Instructions</label>
                        <textarea {...register("senderInstructions")} className="textarea w-full" placeholder="Sender Instructions"></textarea>
                    </fieldset>
                    {/* receiver details */}
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">Receiver Details</h4>

                        {/* receiver name */}
                        <label className="label font-bold">Receiver Name</label>
                        <input type="text" {...register("recieverName")} className="input w-full" placeholder="Receiver Name" />

                        {/* receiver email */}
                        <label className="label font-bold">Receiver Email</label>
                        <input type="email" {...register("receiverEmail")} className="input w-full" placeholder="Receiver Email" />

                        {/* receiver address */}
                        <label className="label font-bold">Receiver Address</label>
                        <input type="text" {...register("receiverAddress")} className="input w-full" placeholder="Receiver Address" />

                        {/* receiver phone */}
                        <label className="label font-bold">Receiver Phone No</label>
                        <input type="text" {...register("receiverPhoneNo")} className="input w-full" placeholder="Receiver Phone No" />

                        {/* receiver region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver Region</legend>
                            <select {...register("receiverRegion")} defaultValue="Select Region" className="select w-full">
                                <option value="disabled">Select a Region</option>
                                {
                                    regions.map((region, index) => <option key={index} value={region}>{region}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* receiver district */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver District</legend>
                            <select {...register("receiverDistrict")} defaultValue="Select District" className="select w-full">
                                <option value="disabled">Select a District</option>
                                {
                                    districtByRegion(receiverRegion)?.map((district, index) => <option key={index} value={district}>{district}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* delivery instructions */}
                        <label className="label font-black">Delivery Instructions</label>
                        <textarea {...register("deliveryInstructions")} className="textarea w-full" placeholder="Delivery Instructions"></textarea>
                    </fieldset>
                </div>
                <input type="submit" className='btn btn-primary text-black mt-4 px-10' value="Proceed to Confirm Booking" />
            </form>
        </div>
    );
};

export default SendParcel;