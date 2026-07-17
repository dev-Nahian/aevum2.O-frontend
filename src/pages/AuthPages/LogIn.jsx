import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import signUpImg from "@/assets/Images/SignUpImage2.webp";
import { authAPI } from "@/lib/apiClient";

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authAPI.login(data.email, data.password);
      localStorage.setItem("aevum_token", response.token);
      localStorage.setItem("aevum_user", JSON.stringify(response.user));
      
      toast.success("Welcome back to AEVUM.");
      setTimeout(() => {
        navigate("/"); // Redirect to landing homepage
      }, 1000);
    } catch (error) {
      if (error.response?.data?.requiresVerification) {
        toast.error("Email not verified. Sending verification code...");
        localStorage.setItem("aevum_signup_email", data.email);
        setTimeout(() => {
          navigate("/auth/verification/otp", { 
            state: { 
              email: data.email,
              devOtp: error.response?.data?.devOtp,
              emailError: error.response?.data?.emailError
            } 
          });
        }, 1200);
      } else {
        toast.error(
          error.response?.data?.message || "Invalid credentials. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-focus email input on mount
  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#FDFAF4]">
      
      {/* ── Left Side: Brand Showcase (Hidden on Mobile) ── */}
      <div className="hidden md:block relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src={signUpImg}
          alt="The Maison Aevum Elegance"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          loading="eager"
        />
        
        {/* Subtle Dark Overlay for Typography Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 z-10" />

        {/* Text Showcase Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 lg:p-16 xl:p-20 z-20 text-[#FDFAF4] flex flex-col gap-4">
          <p className="font-inter text-[10px] sm:text-xs lg:text-sm tracking-[0.25em] sm:tracking-[0.3em] text-[#E2DFD8] uppercase font-semibold">
            THE MAISON
          </p>
          <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight max-w-lg">
            Become part of <br className="hidden sm:block" />
            the AEVUM circle.
          </h1>
          <p className="font-inter text-[11px] sm:text-xs lg:text-sm text-[#D5D2C9] font-light tracking-wide leading-relaxed max-w-sm mt-2">
            Private previews, atelier appointments and complimentary worldwide delivery.
          </p>
        </div>
      </div>

      {/* ── Right Side: Sign In Form ── */}
      <div className="w-full min-h-screen bg-[#FDFAF4] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-[500px] mx-auto flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <span className="font-inter text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase font-medium block mb-4">
              ACCOUNT
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-[56px] font-medium text-[#13110F] leading-tight sm:leading-[56px]">
              Sign In
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#72706F] font-light tracking-wide mt-3 sm:mt-5">
              Begin your journey with the AEVUM.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 sm:gap-8">
            
            {/* Email Address */}
            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="email" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                EMAIL ADDRESS*
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full bg-transparent border-b py-2.5 sm:py-3 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                  errors.email 
                    ? "border-red-400 focus:border-red-600" 
                    : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                }`}
                placeholder="Enter your email address"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="relative flex flex-col gap-1.5">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                  PASSWORD*
                </label>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    const emailInput = watch("email");
                    if (!emailInput) {
                      toast.error("Please enter your email address first.");
                      return;
                    }
                    try {
                      toast.loading("Sending reset instructions...", { id: "forgot" });
                      await authAPI.forgotPassword(emailInput);
                      toast.success("Password reset code sent to your email!", { id: "forgot" });
                      localStorage.setItem("aevum_reset_email", emailInput);
                      navigate("/auth/new-password", { state: { email: emailInput } });
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to send reset code.", { id: "forgot" });
                    }
                  }}
                  className="font-inter text-[11px] sm:text-xs tracking-[0.05em] text-[#72706F] hover:text-[#1A1A1A] uppercase font-medium underline transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm px-1 py-0.5"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative w-full">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className={`w-full bg-transparent border-b py-2.5 sm:py-3 pr-10 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                    errors.password 
                      ? "border-red-400 focus:border-red-600" 
                      : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                  }`}
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#72706F] hover:text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A1A1A] hover:bg-[#2C2A29] text-[#FDFAF4] py-3.5 sm:py-4 text-[11px] sm:text-xs font-sans tracking-[0.2em] sm:tracking-[0.25em] font-medium uppercase transition-all duration-300 mt-2 active:scale-[0.99] flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 disabled:bg-[#9B9694] disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  SIGNING IN...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          {/* Don't have an account */}
          <div className="text-center font-inter text-[11px] sm:text-xs text-[#72706F] tracking-wide mt-6 sm:mt-8">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="underline text-[#1A1A1A] font-medium hover:text-[#2C2A29] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm px-1"
            >
              Create Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}