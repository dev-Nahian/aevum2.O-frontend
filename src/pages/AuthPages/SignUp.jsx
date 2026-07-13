import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import signUpImg from "@/assets/Images/SignUpImage.png";
import { authAPI } from "@/lib/apiClient";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await authAPI.register(
        data.fullName,
        data.email,
        data.mobileNumber,
        data.password,
        data.agreeTerms
      );
      toast.success(response.message || "OTP code sent to email.");
      localStorage.setItem("aevum_signup_email", data.email);
      setTimeout(() => {
        navigate("/auth/verification/otp", { state: { email: data.email } });
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* ── Right Side: Register Form ── */}
      <div className="w-full min-h-screen bg-[#FDFAF4] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-[500px] mx-auto flex flex-col justify-center">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <span className="font-inter text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase font-medium block mb-4">
              ACCOUNT
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-[56px] font-medium text-[#13110F] leading-tight sm:leading-[56px]">
              Create Account
            </h2>
            <p className="font-inter text-sm sm:text-base text-[#72706F] font-light tracking-wide mt-3 sm:mt-5">
              Begin your journey with the AEVUM.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 sm:gap-8">
            
            {/* Full Name */}
            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="fullName" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                FULL NAME*
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                {...register("fullName", { required: "Full name is required" })}
                className={`w-full bg-transparent border-b py-2.5 sm:py-3 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                  errors.fullName 
                    ? "border-red-400 focus:border-red-600" 
                    : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                }`}
                aria-invalid={errors.fullName ? "true" : "false"}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <span id="fullName-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                  {errors.fullName.message}
                </span>
              )}
            </div>

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
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Mobile Number */}
            <div className="relative flex flex-col gap-1.5">
              <label htmlFor="mobileNumber" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                MOBILE NUMBER*
              </label>
              <input
                id="mobileNumber"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                {...register("mobileNumber", { 
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9+\s()\-]{8,}$/,
                    message: "Please enter a valid mobile number",
                  }
                })}
                className={`w-full bg-transparent border-b py-2.5 sm:py-3 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                  errors.mobileNumber 
                    ? "border-red-400 focus:border-red-600" 
                    : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                }`}
                aria-invalid={errors.mobileNumber ? "true" : "false"}
                aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
              />
              {errors.mobileNumber && (
                <span id="mobileNumber-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                  {errors.mobileNumber.message}
                </span>
              )}
            </div>

            {/* Passwords (Side-by-side on Desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Password */}
              <div className="relative flex flex-col gap-1.5">
                <label htmlFor="password" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                  PASSWORD*
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Must be at least 6 characters",
                      },
                    })}
                    className={`w-full bg-transparent border-b py-2.5 sm:py-3 pr-10 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                      errors.password 
                        ? "border-red-400 focus:border-red-600" 
                        : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                    }`}
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

              {/* Confirm Password */}
              <div className="relative flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                  CONFIRM PASSWORD*
                </label>
                <div className="relative w-full">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                    className={`w-full bg-transparent border-b py-2.5 sm:py-3 pr-10 text-sm text-[#13110F] font-sans focus:outline-none transition-colors duration-300 placeholder-[#C9C6C0] min-h-[44px] ${
                      errors.confirmPassword 
                        ? "border-red-400 focus:border-red-600" 
                        : "border-[#E2DFD8] focus:border-[#1A1A1A]"
                    }`}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#72706F] hover:text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span id="confirmPassword-error" className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 mt-1">
              <input
                type="checkbox"
                id="agreeTerms"
                {...register("agreeTerms", {
                  required: "You must agree to the Terms & Privacy Policy",
                })}
                className="w-4 h-4 mt-0.5 border border-[#D9D5D2] rounded-sm bg-transparent checked:bg-[#1A1A1A] checked:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/30 cursor-pointer accent-black"
              />
              <div className="flex flex-col">
                <label htmlFor="agreeTerms" className="font-inter text-[11px] sm:text-xs text-[#72706F] tracking-wide cursor-pointer select-none leading-relaxed">
                  I agree to the{" "}
                  <Link
                    to="/legal/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#1A1A1A] hover:text-[#2C2A29] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms
                  </Link>{" "}
                  &{" "}
                  <Link
                    to="/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#1A1A1A] hover:text-[#2C2A29] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
                {errors.agreeTerms && (
                  <span className="font-inter text-[10px] text-red-600 mt-1 tracking-wide" role="alert">
                    {errors.agreeTerms.message}
                  </span>
                )}
              </div>
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
                  CREATING...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div className="text-center font-inter text-[11px] sm:text-xs text-[#72706F] tracking-wide mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="underline text-[#1A1A1A] font-medium hover:text-[#2C2A29] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm px-1"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}