import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocalLogin/SocialLogin';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { signInUser }=useAuth();
    const location = useLocation();
    const navigate = useNavigate();


    const handleLogin = data => {
        console.log(data);
        signInUser(data.email, data.password)
        .then(result=>{
            const user=result.user;
            console.log(user);
            navigate(location?.state || '/');
        })
        .catch(error=>{
            console.log(error.message);
        })
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center font-semibold text-secondary ">Welcome Back</h3>
            <p className='text-center  mt-5 font-semibold text-secondary'>Please login</p>
            <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
                <fieldset className="fieldset">
                    {/* email */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                    {errors.email?.type === 'required' && <p className="text-red-600">This field is required</p>}

                    {/* password */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />

                    {errors.password?.type === 'required' && <p className="text-red-600">This field is required</p>}

                    {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters or longer</p>}

                    <div><a className="link link-hover">Forgot password?</a></div>
                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
                <p>New to Zap Shift? <Link 
                state={location.state}
                className='text-blue-500 underline' to='/register'>Register</Link></p>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Login;