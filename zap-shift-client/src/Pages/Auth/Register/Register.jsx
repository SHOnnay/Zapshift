import React from 'react';
import { useForm } from "react-hook-form"
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocalLogin/SocialLogin';
import axios from 'axios';

const Register = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile } = useAuth();

    const location = useLocation();
    const navigation = useNavigate();

    console.log('register location', location)

    const handleRegistration = (data) => {

        console.log('after registration', data.photo[0]);
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);

                //1. store the image and photo url
                const formData = new FormData();
                formData.append('image', profileImg);

                //2. send the photo to imgbb server to get the photo url
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                axios.post(image_API_URL, formData)
                    .then(res => {
                        console.log('after img', res.data.data.display_url);

                        //update user profile with name and photoURL firebase
                        const userProfile = {
                            displayName: data.name,
                            photoURL: res.data.data.display_url
                        }

                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log('user profile updated');
                                navigation(location.state || '/');
                            })
                            .catch(error => {
                                console.log(error.message);
                            })
                    })

            })
            .catch(error => {
                console.log(error.message);
            })
    }

    return (
        <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
            <h3 className="text-3xl text-center font-semibold text-secondary">Welcome to Zap Shift</h3>
            <p className='text-center mt-5 font-semibold text-secondary'>Please Register</p>
            <form onSubmit={handleSubmit(handleRegistration)}>
                <div className="card bg-base-100 w-full max-w-sm shrink-0">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            {/* name  */}
                            <label className="label">Name</label>
                            <input type="text" {...register('name', { required: true })} className="input" placeholder="Your name" />
                            {errors.email?.type === 'required' && <p className="text-red-600">This field is required</p>}
                            {/* image field  */}
                            <label className="label">Photo</label>
                            <input type="file" {...register('photo', { required: true })} className="file-input" placeholder="Your photo" />
                            {errors.email?.type === 'required' && <p className="text-red-600">This field is required</p>}

                            {/* email */}
                            <label className="label">Email</label>
                            <input type="email" {...register('email', { required: true })} className="input" placeholder="Email" />
                            {errors.email?.type === 'required' && <p className="text-red-600">This field is required</p>}

                            {/* password */}
                            <label className="label">Password</label>
                            <input type="password" {...register('password', {
                                required: true, minLength: 8,
                                pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
                            })} className="input" placeholder="Password" />

                            {errors.password?.type === 'required' && <p className="text-red-600">This field is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 8 characters or longer</p>}
                            {
                                errors.password?.type === 'pattern' && <p className="text-red-600 font-semibold">Password must contain at least one uppercase letter, one lowercase letter and one number.</p>
                            }

                            <div><a className="link link-hover">Forgot password?</a></div>
                            <button className="btn btn-neutral mt-4">Register</button>
                        </fieldset>
                        <p>Already have an account? <Link
                        state={location.state}
                        className='text-blue-500 underline' to='/login'>Login</Link></p>
                    </div>
                </div>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;