import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 px-6 relative overflow-hidden">

      {/* Floating Background Blur */}
      <div className="absolute top-[-100px] left-[-120px] w-[420px] h-[420px] bg-red-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[350px] h-[350px] bg-slate-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg w-full text-center space-y-8"
      >
        {/* Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-[320px] mx-auto"
        >
          <DotLottieReact
            src="https://lottie.host/7864f1d2-0994-477b-8326-880908866f8e/R8o4R6O4fO.lottie"
            loop
            autoplay
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-black text-slate-900"
        >
          Access <span className="text-red-500">Denied</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto"
        >
          You don’t have permission to access this page.  
          If you believe this is a mistake, please contact the administrator.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="btn btn-neutral rounded-full px-6 text-lg shadow-md hover:shadow-xl transition-all"
          >
            <FaArrowLeft className="mr-2" />
            Back Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline rounded-full px-6 text-lg"
          >
            Try Again
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Forbidden;