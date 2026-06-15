import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { FcGoogle } from 'react-icons/fc';

const SocialLogin = () => {
    const { signInGoogle } = useAuth();
    const axiosPublic = useAxiosPublic();
    const location = useLocation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleGoogleSignIn = async () => {
        setError('');
        setSubmitting(true);

        try {
            const result = await signInGoogle();

            const userInfo = {
                displayName: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
            };

            await axiosPublic.post('/users', userInfo);

            navigate(location?.state || '/');
        } catch (error) {
            console.error(error);
            setError(error?.response?.data?.message || error?.message || 'Google sign in failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="px-8 pb-8 text-center">
            <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                or continue with
                <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
                type="button"
                disabled={submitting}
                onClick={handleGoogleSignIn}
                className="btn w-full rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-secondary/30 hover:bg-slate-50 disabled:opacity-60"
            >
                <FcGoogle className="text-xl" />
                {submitting ? 'Connecting...' : 'Login with Google'}
            </button>

            {error && <p className="mt-3 text-sm font-semibold text-red-500">{error}</p>}
        </div>
    );
};

export default SocialLogin;