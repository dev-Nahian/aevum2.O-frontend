import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/shared/LendingShared/Navbar";
import Footer from "@/shared/LendingShared/Footer";
import PromotionalHeader from "@/shared/LendingShared/PromotionalHeader";

export default function NewPassword() {
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
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  // Auto-focus new password field on mount
  useEffect(() => {
    document.getElementById("password")?.focus();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast.success("Password reset successfully!");
    setTimeout(() => {
      navigate("/auth/login"); // Redirect to login page
    }, 1000);
  };

  // Password strength checker (optional enhancement)
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4); // Cap at 4 bars
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  return (
    <div className="min-h-screen bg-[#FDFAF4] flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Promotional Banner */}
        <PromotionalHeader />

        {/* Global Navigation Header */}
        <Navbar />

        {/* ── Main Reset Form Section ── */}
        <main className="flex-1 flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="w-full max-w-[480px] mx-auto">
            
            {/* Header */}
            <div className="mb-8 sm:mb-10 flex flex-col items-center text-center">
              <span className="font-inter text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase font-medium block mb-3 sm:mb-4">
                THE AEVUM
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-[56px] font-medium text-[#13110F] leading-tight sm:leading-[1.15]">
                New Password
              </h2>
              <p className="font-inter text-sm sm:text-base text-[#72706F] font-light tracking-wide mt-3 sm:mt-4 max-w-[360px] sm:max-w-[380px]">
                Create a new password to continue your journey with the AEVUM.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 sm:gap-6">
              
              {/* New Password */}
              <div className="relative flex flex-col gap-1.5">
                <label htmlFor="password" className="font-inter text-[11px] sm:text-xs tracking-[0.1em] text-[#72706F] uppercase font-medium">
                  NEW PASSWORD*
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password", {
                      required: "New password is required",
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
                    placeholder="Enter your new password"
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
                
                {/* Password Strength Indicator (Optional) */}
                {passwordValue && (
                  <div className="flex gap-1 mt-2" aria-hidden="true">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          passwordStrength >= level
                            ? passwordStrength <= 2 ? "bg-red-400" : passwordStrength === 3 ? "bg-amber-400" : "bg-green-500"
                            : "bg-[#E2DFD8]"
                        }`}
                      />
                    ))}
                  </div>
                )}
                
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
                    placeholder="Confirm your new password"
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

              {/* Password Requirements Hint */}
              <div className="bg-[#F8F2EB] border border-[#E5E2DA] rounded-sm p-3 sm:p-4">
                <p className="font-inter text-[10px] sm:text-xs text-[#72706F] tracking-wide">
                  Password must include:
                </p>
                <ul className="mt-2 space-y-1">
                  {[
                    { label: "At least 6 characters", met: passwordValue?.length >= 6 },
                    { label: "One uppercase letter", met: /[A-Z]/.test(passwordValue || "") },
                    { label: "One number", met: /[0-9]/.test(passwordValue || "") },
                  ].map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[10px] sm:text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${req.met ? "bg-green-500" : "bg-[#C9C6C0]"}`} />
                      <span className={req.met ? "text-[#1A1A1A]" : "text-[#72706F]"}>{req.label}</span>
                    </li>
                  ))}
                </ul>
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
                    RESETTING...
                  </>
                ) : (
                  "RESET PASSWORD"
                )}
              </button>
            </form>

            {/* Back to Sign In Link */}
            <div className="text-center mt-6 sm:mt-8">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1 font-inter text-[11px] sm:text-xs text-[#72706F] uppercase tracking-[0.1em] hover:text-[#1A1A1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 rounded-sm px-1 py-0.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back To Sign In
              </Link>
            </div>

          </div>
        </main>
      </div>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}