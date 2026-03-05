import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const Rider = () => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(center => center.region);

    const regions = [...new Set(regionsDuplicate)];
    //explore useMemo for regions

    const districtByRegion = (region) => {
        const regionDistricts = serviceCenters.filter(center => center.region === region);
        const districts = regionDistricts.map(center => center.district);
        return districts;
    };

    const riderRegion = useWatch({
        control,
        name: "region"
    });

    const handleRiderApplication = (data) => {
        console.log(data);
        axiosSecure.post('/riders', data)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        title: "Application Received!",
                        text: "Rider application submitted successfully! We will review your details and get back to you soon.",
                        icon: "success",
                        position: "center", 
                        showConfirmButton: true,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Got it!",
                        timer: 3000,
                        timerProgressBar: true, 
                        showClass: {
                            popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__fadeOutUp'
                        }
                    });
                }
            })
            .catch(error => {
                console.log('error submitting rider application', error);
            })
    }

    return (
        <div>
            <h2 className='text-4xl text-primary ml-4'>Be a Rider</h2>
            <form onSubmit={handleSubmit(handleRiderApplication)} className='mt-12 p-4 text-black'>

                {/* two column layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                    {/* rider info */}

                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">Rider Details</h4>

                        {/* rider name */}
                        <label className="label font-bold">Rider Name</label>
                        <input type="text" {...register("name")}
                            defaultValue={user?.displayName}
                            className="input w-full" placeholder="Rider Name" />

                        {/* rider email */}
                        <label className="label font-bold">Rider Email</label>
                        <input type="email" {...register("email")}
                            defaultValue={user?.email}
                            className="input w-full" placeholder="Rider Email" />


                        {/* rider region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Regions</legend>
                            <select {...register("region")} defaultValue="Select Region" className="select w-full">
                                <option value="disabled" >Select a Region</option>
                                {
                                    regions.map((region, index) => <option key={index} value={region}>{region}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* rider district */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">District</legend>
                            <select {...register("district")} defaultValue="Select District" className="select w-full">
                                <option value="disabled">Select a District</option>
                                {
                                    districtByRegion(riderRegion)?.map((district, index) => <option key={index} value={district}>{district}</option>)
                                }
                            </select>
                        </fieldset>

                        {/* rider address */}
                        <label className="label  font-bold">Your Address</label>
                        <input type="text" {...register("Address")} className="input w-full" placeholder="Rider Address" />

                    </fieldset>


                    {/* receiver details */}
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-bold text-secondary">More Details</h4>

                        {/* receiver name */}
                        <label className="label font-bold">Driving License</label>
                        <input type="text" {...register("license")} className="input w-full" placeholder="Driving License" />

                        {/* receiver email */}
                        <label className="label font-bold ">NID</label>
                        <input type="text" {...register("nid")} className="input w-full" placeholder="NID" />

                        {/* bike information */}
                        <label className="label font-bold mt-1 mb-1">Bike Information</label>
                        <input type="text" {...register("bike")} className="input w-full" placeholder="Bike information" />

                    </fieldset>
                </div>
                <input type="submit" className='btn btn-primary text-black mt-4 px-10' value="Apply as a Rider" />
            </form>
        </div>
    );
};

export default Rider;