import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';


const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {

    const { user, logOutUser } = useAuth();
    const navigate = useNavigate();

    //interecptor to attach token to every request
    const reqInterceptor = useEffect(() => {
        axiosSecure.interceptors.request.use(config => {
            config.headers.authorization = `Bearer ${user?.accessToken}`;
            return config;
        });

        //interceptor to handle unauthorized responses
        const resInterceptor = axiosSecure.interceptors.response.use(
            response => response,
            error => {
                
                const statusCode = error.response?.status;
                if (statusCode === 401 || statusCode === 403) {
                    logOutUser().then(() => {
                        navigate('/login');
                    }).catch(err => {
                        console.error('Error during logout:', err);
                    });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };

    }, [user, logOutUser, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;