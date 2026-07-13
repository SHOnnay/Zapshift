import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocalLogin/SocialLogin';
import { FaArrowRight } from 'react-icons/fa6';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signInUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogin = data => {
        signInUser(data.email, data.password)
            .then(() => navigate(location?.state || '/'))
            .catch(error => console.error('Login error:', error.message));
    };

    return (
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-2xl shadow-secondary/10 backdrop-blur">
            <div className="bg-secondary p-8 text-white">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">Courier access</p>
                <h3 className="mt-3 text-4xl font-black tracking-tight">Welcome back.</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">Login to book parcels, track shipments and manage your ZapShift dashboard.</p>
            </div>
            <form className="p-8" onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset gap-3">
                    <label className="label font-bold text-secondary">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input input-bordered w-full rounded-2xl" placeholder="Email" />
                    {errors.email?.type === 'required' && <p className="text-sm font-semibold text-red-600">Email is required</p>}

                    <label className="label mt-2 font-bold text-secondary">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input input-bordered w-full rounded-2xl" placeholder="Password" />
                    {errors.password?.type === 'required' && <p className="text-sm font-semibold text-red-600">Password is required</p>}
                    {errors.password?.type === 'minLength' && <p className="text-sm font-semibold text-red-600">Password must be 6 characters or longer</p>}

                    <button className="btn btn-primary mt-5 rounded-2xl font-black text-secondary">
                        Login <FaArrowRight />
                    </button>
                </fieldset>
                <p className="mt-5 text-center text-sm text-slate-500">New to ZapShift? <Link state={location.state} className="font-black text-secondary underline" to="/register">Create account</Link></p>
            </form>
            <SocialLogin />
        </div>
    );
};

export default Login;