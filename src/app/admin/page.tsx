"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Optional: for the password visibility toggle
import Image from "next/image";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E1F5FE] px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Left Side: Logo Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center">
          <div className="w-64 h-auto mb-4">
            {/* Replace with your actual logo image file path */}
            <Image
              src="/logo.jpg"
              width={1000}
              height={1000}
              alt="Leadpath Consulting Logo"
              className="w-full scale-180 h-auto object-contain"
            />
          </div>
        </div>

        {/* Center Vertical Divider (Hidden on mobile) */}
        <div className="hidden md:block w-[1px] h-64 bg-[#003A47]/40 self-center"></div>

        {/* Right Side: Login Form Card */}
        <div className="w-full md:w-[460px] bg-white rounded-md shadow-sm p-8 sm:p-10">
          <span className="block text-gray-900 text-lg font-medium mb-6">
            Task Tracker
          </span>

          <h2 className="text-[#003A47] text-xl font-semibold mb-1">
            Welcome Admin
          </h2>
          <p className="text-gray-500 text-xs mb-6">
            Monitor all task from one sign in.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="emailaddress@gmail.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#003A47] focus:border-[#003A47] text-sm text-gray-700"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-[#003A47] focus:border-[#003A47] text-sm text-gray-700 tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 stroke-[1.5]" />
                  ) : (
                    <Eye className="h-4 w-4 stroke-[1.5]" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#003A47] text-white py-3 px-4 rounded-md font-medium text-sm hover:bg-[#002b35] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003A47] mt-8"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
