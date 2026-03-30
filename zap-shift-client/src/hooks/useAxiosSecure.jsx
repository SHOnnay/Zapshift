import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        // get fresh Firebase ID token
        const idToken = await user.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          logOutUser()
            .then(() => navigate('/login'))
            .catch((err) => console.error('Error during logout:', err));
        }
        return Promise.reject(error);
      }
    );

    // cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;