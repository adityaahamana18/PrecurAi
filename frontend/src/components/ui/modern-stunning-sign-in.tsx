"use client";

import * as React from "react";
import { useState } from "react";
import { Shield } from "lucide-react";

interface SignIn1Props {
  onSuccess?: (user: { email: string; name: string }) => void;
  brandName?: string;
  tagline?: string;
}

const SignIn1: React.FC<SignIn1Props> = ({
  onSuccess,
  brandName = "PrecurAi",
  tagline = "SIF Precursor Intelligence Platform"
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    if (onSuccess) {
      onSuccess({
        email,
        name: email.split("@")[0].toUpperCase()
      });
    } else {
      alert(`Signed in successfully as ${email}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F17] relative overflow-hidden w-full py-12 px-4 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/90 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center border border-slate-700/60 card-hover-effect">
        {/* Logo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white mb-4 shadow-lg shadow-sky-500/20">
          <Shield className="w-7 h-7 animate-pulse" />
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white tracking-tight text-center">
          {brandName}
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6 text-center font-medium">
          {tagline}
        </p>

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="HSE Officer Email"
              type="email"
              value={email}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white placeholder-slate-400 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 text-white placeholder-slate-400 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
            {error && (
              <div className="text-xs text-red-400 font-medium text-left bg-red-950/40 p-2 rounded-lg border border-red-900/60">
                {error}
              </div>
            )}
          </div>

          <hr className="opacity-20 border-slate-700" />

          <div>
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-sky-600/25 transition-all mb-3 text-sm active:scale-98"
            >
              Sign In to Platform
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={() => {
                if (onSuccess) {
                  onSuccess({ email: "hse.supervisor@precurai.com", name: "HSE SUPERVISOR" });
                } else {
                  alert("Signed in with Google (Demo)");
                }
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl px-5 py-3 font-medium text-slate-200 border border-slate-700 transition mb-2 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Quick Demo Login (HSE Lead)
            </button>

            <div className="w-full text-center mt-3">
              <span className="text-[11px] text-slate-400">
                Need enterprise credentials?{" "}
                <span className="text-sky-400 font-semibold cursor-pointer hover:underline">
                  Contact HSE Admin
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User count and avatars */}
      <div className="relative z-10 mt-10 flex flex-col items-center text-center">
        <p className="text-slate-400 text-xs mb-2">
          Protected by <span className="font-semibold text-slate-200">PrecurAi Intelligence</span> • Trusted by HSE Teams
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
            alt="HSE User"
            className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
            alt="Safety Auditor"
            className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces"
            alt="Field Engineer"
            className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
            alt="HSE Manager"
            className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
export default SignIn1;
