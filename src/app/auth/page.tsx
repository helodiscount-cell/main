import React from "react";
import Image from "next/image";
import GirlImage from "@/assets/stock-images/Group 248@2x.png";
import GoogleButton from "@/components/auth/GoogleButton";

const AuthPage = async () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] p-4">
      <div className="w-full max-w-5xl overflow-hidden flex flex-col md:flex-row animate-fade-in gap-8">
        {/* Left Side - Auth Form */}
        <div className="bg-white rounded-3xl p-12 w-[50%] flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            {/* DmBroo */}
            <div className="text-center animation-delay-100 animate-fade-in">
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                DmBroo
              </h1>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 animation-delay-200 animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900">Log In</h2>
              <p className="text-gray-600">Welcome to Brand Name!</p>
            </div>

            {/* Google Sign In Button */}
            <GoogleButton />

            {/* Divider */}
            <div className="relative animation-delay-300 animate-fade-in">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2 animation-delay-500 animate-fade-in">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email ID
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all duration-300"
              />
            </div>

            {/* Log In Button */}
            <div className="animation-delay-500 animate-fade-in">
              <button className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold py-3.5 rounded-xl hover:  hover:   -purple-300 transform hover:-translate-y-0.5 transition-all duration-300">
                Log In
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500 animation-delay-500 animate-fade-in leading-5">
              By proceeding you acknowledge that you have read, understood and
              agree to our Terms and Conditions.
            </p>

            {/* Register Link */}
            <p className="text-center text-gray-600 animation-delay-500 animate-fade-in">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Register
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-[50%] relative rounded-3xl bg-[#88769c] h-inherit animation-delay-200 animate-fade-in">
          <div className="absolute -bottom-4 right-32 w-full h-full max-w-md">
            <Image
              src={GirlImage}
              alt="Welcome"
              fill
              className="object-contain drop-   -2xl"
              priority
            />
          </div>
          {/* Decorative gradient overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-purple-200/20 to-transparent pointer-events-none"></div> */}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
