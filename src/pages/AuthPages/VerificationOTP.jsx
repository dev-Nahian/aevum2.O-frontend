import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import signUpImg from "@/assets/Images/SignUpImage.png";
import { authAPI } from "@/lib/apiClient";

export default function VerificationOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const isVerifyingRef = useRef(false);

  // Retrieve dynamic email address if passed from signup flow, or fallback to saved email
  const email = (
    location.state?.email ||
    localStorage.getItem("aevum_signup_email") ||
    "example@aevum.com"
  ).trim();

  const devOtp = location.state?.devOtp;

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
    if (value && isNaN(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Get last typed digit
    setOtp(newOtp);

    // Auto-focus next input box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Keyboard navigation (Backspace & Enter support)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Shift focus back to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "Enter") {
      const enteredCode = otp.join("");
      if (enteredCode.length === 6) {
        triggerVerification();
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

    // Focus last filled input box
    const focusIndex = Math.min(digits.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Reset resend timer
  const handleResend = async () => {
    try {
      const response = await authAPI.resendOTP(email);
      setTimeLeft(120);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      
      const msg = response?.message || "A new verification code has been sent!";
      toast.success(msg);
      if (response?.devOtp) {
        toast(`Dev Code: ${response.devOtp}`, { icon: "🔑", duration: 6000 });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend verification code."
      );
    }
  };

  // Trigger auto-verification when all 6 digits are complete
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete && !isVerifyingRef.current) {
      triggerVerification();
    }
  }, [otp]);

  const triggerVerification = async () => {
    if (isVerifyingRef.current) return;
    
    const enteredCode = otp.join("").trim();
    if (enteredCode.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    isVerifyingRef.current = true;
    setIsVerifying(true);

    try {
      const response = await authAPI.verifyOTP(email, enteredCode);
      localStorage.setItem("aevum_token", response.token);
      localStorage.setItem("aevum_user", JSON.stringify(response.user));
      
      toast.success("Verification successful! Welcome to AEVUM.");
      setTimeout(() => {
        navigate("/"); // Redirect to landing homepage
      }, 800);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Incorrect verification code. Please try again."
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      isVerifyingRef.current = false;
      setIsVerifying(false);
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
          <div className="mb-6 flex flex-col items-center">
            <span className="font-inter text-[14px] sm:text-[16px] text-[#72706F] tracking-[2.56px] font-normal uppercase block my-4">
              VERIFICATION
            </span>
            <h2 className="font-cormorant text-[36px] sm:text-[40px] lg:text-[56px] font-medium text-[#13110F] leading-[56px]">
              Enter Code
            </h2>
            <p className="font-inter text-[14px] sm:text-[16px] text-[#72706F] font-light tracking-wide mt-4 max-w-[340px] leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <span className="font-medium text-[#13110F] select-all">{email}</span>
            </p>

            {/* Dev Mode Code Helper (if present) */}
            {devOtp && (
              <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800 font-inter text-xs">
                <span>Developer Test Code: </span>
                <strong className="font-mono text-sm tracking-widest">{devOtp}</strong>
              </div>
            )}
          </div>

          {/* OTP Input Fields Row */}
          <div className="flex justify-center gap-2 sm:gap-4 my-6" onPaste={handlePaste}>
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
                className="w-11 h-12 sm:w-14 sm:h-14 bg-transparent border border-[#E2DFD8] text-center text-xl sm:text-2xl text-[#13110F] font-sans focus:outline-none focus:border-neutral-900 transition-colors duration-300 rounded-none disabled:opacity-50"
              />
            ))}
          </div>

          {/* Manual Submit Button */}
          <button
            type="button"
            onClick={triggerVerification}
            disabled={isVerifying || otp.some((d) => d === "")}
            className="w-full max-w-[320px] bg-[#1A1A1A] hover:bg-[#2C2A29] text-[#FDFAF4] py-3.5 text-xs font-sans tracking-[0.2em] font-medium uppercase transition-all duration-300 my-4 active:scale-[0.99] flex items-center justify-center gap-2 disabled:bg-[#9B9694] disabled:cursor-not-allowed cursor-pointer"
          >
            {isVerifying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                VERIFYING...
              </>
            ) : (
              "VERIFY & CONTINUE"
            )}
          </button>

          {/* Actions Bottom List */}
          <div className="flex flex-col items-center gap-5 mt-4">
            {/* Countdown / Resend Trigger */}
            <div className="font-inter text-[14px] tracking-[0.1em] text-[#72706F] uppercase font-medium">
              {timeLeft > 0 ? (
                `RESEND IN ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`
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

            {/* Change Account / Back Navigation */}
            <Link
              to="/auth/signup"
              className="font-inter text-[14px] tracking-[0.1em] text-[#72706F] hover:text-black uppercase font-medium transition-colors"
            >
              CHANGE EMAIL OR NUMBER
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
