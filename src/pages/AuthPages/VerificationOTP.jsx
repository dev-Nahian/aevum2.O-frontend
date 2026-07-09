import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import signUpImg from "@/assets/Images/SignUpImage.png";

export default function VerificationOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Retrieve dynamic email address if passed from signup flow, or fallback to mockup email
  const email = location.state?.email || "example@aevum.com";

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle single digit input
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Get last typed digit
    setOtp(newOtp);

    // Auto-focus next input box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Keyboard navigation (Backspace support)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Shift focus back to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle clipboard paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return; // Only numeric pastes allowed

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    
    setOtp(newOtp);

    // Focus last filled or 6th input box
    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  // Reset resend timer
  const handleResend = () => {
    setTimeLeft(30);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
    toast.success("A new verification code has been sent!");
  };

  // Trigger auto-verification when all 6 digits are complete
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete && !isVerifying) {
      triggerVerification();
    }
  }, [otp]);

  const triggerVerification = async () => {
    setIsVerifying(true);
    const enteredCode = otp.join("");

    // Simulate verification API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);

    if (enteredCode === "123456" || enteredCode.length === 6) {
      toast.success("Verification successful! Welcome aboard.");
      setTimeout(() => {
        navigate("/auth");
      }, 1000);
    } else {
      toast.error("Incorrect verification code. Please try again.");
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
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
        />
        
        {/* Subtle Dark Overlay to Ensure Typography Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 z-10" />

        {/* Text Showcase Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-12 lg:p-16 xl:p-20 z-20 text-[#FDFAF4] flex flex-col gap-4">
          <p className="font-inter text-xs lg:text-sm tracking-[0.3em] text-[#E2DFD8] uppercase font-semibold">
            THE MAISON
          </p>
          <h1 className="font-cormorant text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-tight max-w-lg">
            Become part of <br />
            the AEVUM circle.
          </h1>
          <p className="font-inter text-xs lg:text-sm text-[#D5D2C9] font-light tracking-[0.05em] leading-relaxed max-w-sm mt-2">
            Private previews, atelier appointments and complimentary worldwide delivery.
          </p>
        </div>
      </div>

      {/* ── Right Side: Verification Form ── */}
      <div className="w-full min-h-screen bg-[#FDFAF4] flex flex-col justify-center py-12 px-6 sm:px-16 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full max-w-[500px] mx-auto flex flex-col items-center justify-center text-center">
          
          {/* Header */}
          <div className="mb-8 flex flex-col items-center">
            <span className="font-inter text-[16px] text-[#72706F] tracking-[2.56px] font-normal uppercase block my-5">
              VERIFICATION
            </span>
            <h2 className="font-cormorant text-[40px] lg:text-[56px] font-medium text-[#13110F] leading-[56px]">
              Enter Code
            </h2>
            <p className="font-inter text-[16px] text-[#72706F] font-light tracking-wide mt-5 max-w-[340px] leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <span className="font-medium text-[#13110F] select-all">{email}</span>
            </p>
          </div>

          {/* OTP Input Fields Row */}
          <div className="flex justify-center gap-3 sm:gap-4 my-8" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                disabled={isVerifying}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-transparent border border-[#E2DFD8] text-center text-xl sm:text-2xl text-[#13110F] font-sans focus:outline-none focus:border-neutral-900 transition-colors duration-300 rounded-none disabled:opacity-50"
              />
            ))}
          </div>

          {/* Verification States / Loader */}
          {isVerifying && (
            <p className="font-inter text-xs text-neutral-500 tracking-[0.1em] uppercase animate-pulse mb-6">
              Verifying Code...
            </p>
          )}

          {/* Actions Bottom List */}
          <div className="flex flex-col items-center gap-6 mt-4">
            {/* Countdown / Resend Trigger */}
            <div className="font-inter text-[14px] tracking-[0.1em] text-[#72706F] uppercase font-medium">
              {timeLeft > 0 ? (
                `RESEND IN 0:${timeLeft < 10 ? "0" : ""}${timeLeft}`
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="underline text-[#13110F] hover:text-neutral-600 transition-colors cursor-pointer font-semibold tracking-[0.1em]"
                >
                  RESEND CODE
                </button>
              )}
            </div>

            {/* Change Mobile Number / Back Navigation */}
            <Link
              to="/auth/signup"
              className="font-inter text-[14px] tracking-[0.1em] text-[#72706F] hover:text-black uppercase font-medium transition-colors"
            >
              CHANGE NUMBER
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
