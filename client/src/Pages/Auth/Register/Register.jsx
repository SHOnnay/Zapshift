import React from 'react';
import { useForm } from "react-hook-form";
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocalLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaArrowRight } from 'react-icons/fa6';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();
    const location = useLocation();
    const navigation = useNavigate();
    const axiosSecure = useAxiosSecure();

    const handleRegistration = async (data) => {
        try {
            const result = await registerUser(data.email, data.password);
            const token = await result.user.getIdToken();
            const profileImg = data.photo?.[0];
            let photoURL = '';

            if (profileImg) {
                const formData = new FormData();
                formData.append('image', profileImg);
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
                const res = await axios.post(image_API_URL, formData);
                photoURL = res.data.data.display_url;
            }

            const userInfo = {
                displayName: data.name,
                email: data.email,
                photoURL,
            };

            await axiosSecure.post('/users', userInfo, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await updateUserProfile({ displayName: data.name, photoURL });
            navigation(location.state || '/');
        } catch (error) {
            console.error('Registration error:', error.message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl shadow-secondary/10 backdrop-blur">
            <div className="bg-secondary p-8 text-white">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Join ZapShift</p>
                <h3 className="mt-3 text-4xl font-black tracking-tight">Create account.</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">Start booking parcels, saving delivery history and managing your courier workflow.</p>
            </div>
            <form onSubmit={handleSubmit(handleRegistration)} className="p-8">
                <fieldset className="fieldset gap-3">
                    <label className="label font-bold text-secondary">Name</label>
                    <input type="text" {...register('name', { required: true })} className="input input-bordered w-full rounded-2xl" placeholder="Your name" />
                    {errors.name?.type === 'required' && <p className="text-sm font-semibold text-red-600">Name is required</p>}

                    <label className="label mt-2 font-bold text-secondary">Photo</label>
                    <input type="file" {...register('photo')} className="file-input file-input-bordered w-full rounded-2xl" />

                    <label className="label mt-2 font-bold text-secondary">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input input-bordered w-full rounded-2xl" placeholder="Email" />
                    {errors.email?.type === 'required' && <p className="text-sm font-semibold text-red-600">Email is required</p>}

                    <label className="label mt-2 font-bold text-secondary">Password</label>
                    <input type="password" {...register('password', {
                        required: true, minLength: 8,
                        pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
                    })} className="input input-bordered w-full rounded-2xl" placeholder="Password" />
                    {errors.password?.type === 'required' && <p className="text-sm font-semibold text-red-600">Password is required</p>}
                    {errors.password?.type === 'minLength' && <p className="text-sm font-semibold text-red-600">Password must be 8 characters or longer</p>}
                    {errors.password?.type === 'pattern' && <p className="text-sm font-semibold text-red-600">Password must contain letters and a number.</p>}

                    <button className="btn btn-primary mt-5 rounded-2xl font-black text-secondary">
                        Register <FaArrowRight />
                    </button>
                </fieldset>
                <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link state={location.state} className="font-black text-secondary underline" to="/login">Login</Link></p>
            </form>
            <SocialLogin />
        </div>
    );
};

export default Register;