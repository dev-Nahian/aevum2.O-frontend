import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { orderAPI } from "@/lib/apiClient";
import { clearCart } from "@/Redux/cartSlice";
import {
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  User,
  Landmark,
  Truck,
  ShieldCheck,
  HelpCircle,
  ArrowLeft,
  Tag,
  Check,
  Lock,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/common/Container";

// Import default perfume image for showcase fallback
import perfumeImage from "@/assets/Images/perfume.png";

// Mock logged-in user profile
const MOCK_LOGGED_IN_USER = {
  name: "Nahian Chowdhury",
  phone: "+880 1712-345678",
  address: "House 42, Road 11, Banani",
  city: "Dhaka",
  postalCode: "1213",
  country: "Bangladesh",
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderPayload, setOrderPayload] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("aevum_user") || "null");
  const isLoggedIn = !!localStorage.getItem("aevum_token");
  const [isGuestMode, setIsGuestMode] = useState(!isLoggedIn);

  // Promo Code States
  const [promoInput, setPromoInput] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Retrieve checkout state from react-router navigation (if any)
  const checkoutState = location.state || {};

  // Default fallback item if no order state is present (so page always looks complete and beautiful)
  const defaultItems = [
    {
      productId: 1,
      title: "Imagination",
      category: "Fragrance",
      price: 320,
      quantity: 1,
      image: perfumeImage,
      size: "100ml",
    },
  ];

  // Determine if we are checking out from Cart or Direct Purchase
  const isFromCart = checkoutState.fromCart || false;
  const checkoutItems = checkoutState.items || defaultItems;

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      paymentMethod: "cash_on_delivery",
      saveInfo: true,
    },
  });

  const watchPaymentMethod = watch("paymentMethod", "cash_on_delivery");
  const watchAllFields = watch();

  // Handle Prefill trigger based on user auth state toggle
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("aevum_user") || "null");
    if (!isGuestMode && isLoggedIn && user) {
      setValue("name", user.fullName || user.name || "");
      setValue("phone", user.mobileNumber || user.phone || "");
      setValue("address", user.address || "");
      setValue("city", user.city || "");
      setValue("postalCode", user.postalCode || "");
      setValue("country", user.country || "Bangladesh");
    } else {
      // Reset to empty values for manual Guest Checkout
      setValue("name", "");
      setValue("phone", "");
      setValue("address", "");
      setValue("city", "");
      setValue("postalCode", "");
      setValue("country", "");
    }
  }, [isGuestMode, isLoggedIn, setValue]);

  // Calculate Summary Totals
  const subtotal = checkoutItems.reduce((acc, item) => {
    const itemPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^0-9.]/g, ""))
        : item.price;
    return acc + itemPrice * (item.quantity || 1);
  }, 0);

  const shipping = 0; // Complimentary luxury shipping
  const total = subtotal - promoDiscount + shipping;

  // Handle Promo Code application
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    setPromoError("");

    setTimeout(() => {
      const formattedCode = promoInput.trim().toUpperCase();
      if (
        formattedCode === "AEVUMWELCOME" ||
        formattedCode === "LUXURY10" ||
        formattedCode === "ATELIER10"
      ) {
        const discount = Math.round(subtotal * 0.1);
        setPromoDiscount(discount);
        setAppliedPromo(formattedCode);
        setPromoError("");
        toast.success("Promo code applied: 10% luxury discount!");
      } else if (formattedCode === "ATELIER50") {
        const discount = Math.round(subtotal * 0.5);
        setPromoDiscount(discount);
        setAppliedPromo(formattedCode);
        setPromoError("");
        toast.success("Atelier VIP code applied: 50% discount!");
      } else {
        setPromoError("Invalid promotional code");
        setPromoDiscount(0);
        setAppliedPromo(null);
      }
      setIsApplyingPromo(false);
    }, 800);
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoInput("");
    setPromoError("");
    toast.success("Promotional code removed");
  };

  // Handle Order Submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("aevum_token");

    const payload = {
      shippingAddress: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
      },
      paymentMethod: data.paymentMethod,
    };

    if (isFromCart && token) {
      payload.fromCart = true;
    } else {
      payload.items = checkoutItems.map((item) => ({
        productId: String(item._id || item.productId || item.id),
        quantity: item.quantity || 1,
        size: item.size || "100ml",
      }));
    }

    if (appliedPromo) {
      payload.promotionalCode = appliedPromo;
      payload.discountApplied = promoDiscount;
    }

    try {
      const response = await orderAPI.create(payload);
      setOrderPayload(response.order || response);
      
      if (isFromCart) {
        dispatch(clearCart());
      }
      
      setIsSuccess(true);
      toast.success("Order Placed Successfully!", {
        position: "bottom-center",
        style: {
          background: "#1C1B1A",
          color: "#FDFAF4",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "0px",
          border: "1px solid #E2DFD8",
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-16 md:py-24 bg-[#FDFAF4] min-h-[90vh] flex items-center">
        <Container>
          <div className="max-w-3xl mx-auto bg-white border border-[#E2DFD8] p-8 md:p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full border border-[#13110F] flex items-center justify-center mx-auto mb-6 text-[#13110F]">
              <CheckCircle2 size={32} strokeWidth={1} />
            </div>

            <h1 className="font-cormorant text-3xl md:text-5xl font-light text-[#13110F] tracking-wide mb-4">
              Order Confirmed
            </h1>
            <p className="font-inter text-sm text-[#72706F] font-light max-w-md mx-auto mb-8 leading-relaxed">
              Your reservation has been authenticated. A verification email
              containing your private receipt and tracking code is en route to
              your inbox.
            </p>

            {/* Order Details Summary inside receipt */}
            <div className="mb-8 border border-[#E2DFD8] bg-[#FDFAF4]/40 p-6 text-left">
              <h3 className="font-inter text-xs font-semibold text-[#13110F] tracking-[0.25em] uppercase border-b border-[#E2DFD8] pb-3 mb-4">
                Atelier Receipt
              </h3>
              <div className="space-y-3 mb-6">
                {checkoutItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs text-[#13110F]"
                  >
                    <span className="font-inter font-light">
                      {item.title}{" "}
                      <span className="text-[#72706F] text-[10px] ml-1">
                        x{item.quantity || 1}
                      </span>
                    </span>
                    <span className="font-cormorant font-semibold text-sm">
                      {typeof item.price === "number"
                        ? `৳${item.price * (item.quantity || 1)}`
                        : item.price}
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#E2DFD8] pt-3 mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-[#72706F]">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toLocaleString()}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-xs text-[#72706F]">
                      <span>Promotion ({appliedPromo})</span>
                      <span>-৳{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-[#72706F]">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-medium uppercase tracking-wider text-[10px]">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#13110F] font-semibold uppercase tracking-wider pt-2 border-t border-[#E2DFD8] border-dashed">
                    <span>Grand Total</span>
                    <span>৳{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-[#72706F] leading-relaxed border-t border-[#E2DFD8] pt-4">
                <span className="block font-semibold uppercase tracking-wider text-[#13110F] mb-1.5 text-[9px]">
                  Shipping Destination:
                </span>
                {orderPayload?.shippingAddress.name}
                <br />
                {orderPayload?.shippingAddress.address},{" "}
                {orderPayload?.shippingAddress.city}{" "}
                {orderPayload?.shippingAddress.postalCode},{" "}
                {orderPayload?.shippingAddress.country}
                <br />
                <span className="block font-semibold uppercase tracking-wider text-[#13110F] mt-3 mb-1.5 text-[9px]">
                  Payment Mode:
                </span>
                <span className="uppercase text-[#13110F]">
                  {orderPayload?.paymentMethod.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Display Exact Payload for developer validation */}
            <details className="group mb-8 text-left border border-[#E2DFD8] rounded-none">
              <summary className="flex items-center justify-between cursor-pointer p-4 bg-[#FAF9F6] select-none">
                <span className="font-inter text-[10px] font-bold text-[#1A1A1A] tracking-[0.15em] uppercase">
                  Developer JSON Payload
                </span>
                <span className="px-2 py-0.5 bg-black text-[#FDFAF4] text-[8px] font-bold tracking-widest uppercase">
                  Inspect API Structure
                </span>
              </summary>
              <div className="p-4 border-t border-[#E2DFD8] bg-[#FDFAF4]/20">
                <pre className="font-mono text-[10px] text-[#2C2A29] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(orderPayload, null, 2)}
                </pre>
              </div>
            </details>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1A1A1A] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#2C2A29] transition-colors min-h-[44px]"
              >
                Return to Collection
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FDFAF4] min-h-screen text-[#13110F]">
      <Container>
        {/* Custom Elegant Step Progress Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-[#E2DFD8] pb-8">
          <div>
            {/* Elegant Breadcrumbs & Stepper */}
            <div className="flex items-center gap-2 mb-4 text-[10px] font-medium tracking-[0.2em] text-[#72706F] uppercase">
              <Link
                to="/wishlist"
                className="hover:text-[#13110F] transition-colors"
              >
                01 Selection
              </Link>
              <ChevronRight size={10} className="text-[#C9C6C0]" />
              <span className="text-[#13110F] font-semibold">
                02 Details & Payment
              </span>
              <ChevronRight size={10} className="text-[#C9C6C0]" />
              <span className="text-[#C9C6C0]">03 Confirmation</span>
            </div>
            <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#13110F]">
              Secure Checkout
            </h1>
          </div>

          {/* Member Toggle switch */}
          <div className="flex items-center gap-4 bg-[#FAF9F6] border border-[#E2DFD8] p-1.5 rounded-none">
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) {
                  setIsGuestMode(false);
                } else {
                  navigate("/auth/login", { state: { from: location } });
                }
              }}
              className={`px-5 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase rounded-none transition-all duration-300 ${
                !isGuestMode && isLoggedIn
                  ? "bg-[#1A1A1A] text-[#FDFAF4] shadow-sm"
                  : "text-[#72706F] hover:text-[#13110F]"
              }`}
            >
              Member Autofill
            </button>
            <button
              type="button"
              onClick={() => setIsGuestMode(true)}
              className={`px-5 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase rounded-none transition-all duration-300 ${
                isGuestMode
                  ? "bg-[#1A1A1A] text-[#FDFAF4] shadow-sm"
                  : "text-[#72706F] hover:text-[#13110F]"
              }`}
            >
              Guest Checkout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* ── Left Column: Checkout Details Form (7 Cols) ── */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12">
            {/* Member Welcome Card */}
            {!isGuestMode && isLoggedIn && currentUser && (
              <div className="bg-[#FAF9F6] border border-[#E2DFD8] p-6 text-xs text-[#13110F] font-inter flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500 ease-out animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-[#E2DFD8] bg-[#FDFAF4] flex items-center justify-center text-[#13110F] shrink-0">
                    <User size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs tracking-wider uppercase mb-1">
                      Aevum Elite Member
                    </h4>
                    <p className="text-[#72706F] font-light leading-relaxed">
                      Welcome back, <strong>{currentUser.fullName || currentUser.name}</strong>.
                      Your shipping credentials have been prefilled.
                      Complimentary courier delivery has been applied.
                    </p>
                  </div>
                </div>
                <span className="bg-[#1A1A1A] text-[#FDFAF4] text-[8px] font-bold tracking-[0.25em] px-3 py-1 uppercase rounded-none self-end sm:self-center">
                  Privileges Active
                </span>
              </div>
            )}

            {/* Main Checkout Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* Form Section 1: Shipping Address */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E2DFD8] pb-3 mb-6">
                  <span className="font-cormorant text-xl font-light italic text-[#72706F]">
                    01.
                  </span>
                  <h3 className="font-inter text-xs font-semibold text-[#13110F] tracking-[0.2em] uppercase">
                    Shipping Destination
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Recipient Name */}
                  <div className="relative flex flex-col pt-3 group">
                    <input
                      id="name"
                      type="text"
                      placeholder=" "
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters",
                        },
                      })}
                      className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                        errors.name
                          ? "border-red-400 focus:border-red-600"
                          : "border-[#E2DFD8] focus:border-[#13110F]"
                      }`}
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                        watchAllFields.name
                          ? "top-[-8px] text-[#13110F] text-[9px]"
                          : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                      }`}
                    >
                      Full Name *
                    </label>
                    {errors.name && (
                      <span
                        className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                        role="alert"
                      >
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="relative flex flex-col pt-3 group">
                    <input
                      id="phone"
                      type="tel"
                      placeholder=" "
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[0-9\s\-()]{8,20}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                        errors.phone
                          ? "border-red-400 focus:border-red-600"
                          : "border-[#E2DFD8] focus:border-[#13110F]"
                      }`}
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                        watchAllFields.phone
                          ? "top-[-8px] text-[#13110F] text-[9px]"
                          : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                      }`}
                    >
                      Phone Number *
                    </label>
                    {errors.phone && (
                      <span
                        className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                        role="alert"
                      >
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="relative flex flex-col pt-3 group">
                  <input
                    id="address"
                    type="text"
                    placeholder=" "
                    {...register("address", {
                      required: "Street address is required",
                      minLength: {
                        value: 5,
                        message:
                          "Address details should be at least 5 characters",
                      },
                    })}
                    className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                      errors.address
                        ? "border-red-400 focus:border-red-600"
                        : "border-[#E2DFD8] focus:border-[#13110F]"
                    }`}
                  />
                  <label
                    htmlFor="address"
                    className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                      watchAllFields.address
                        ? "top-[-8px] text-[#13110F] text-[9px]"
                        : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                    }`}
                  >
                    Street Address *
                  </label>
                  {errors.address && (
                    <span
                      className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                      role="alert"
                    >
                      {errors.address.message}
                    </span>
                  )}
                </div>

                {/* City, Postal Code, Country Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {/* City */}
                  <div className="relative flex flex-col pt-3 group">
                    <input
                      id="city"
                      type="text"
                      placeholder=" "
                      {...register("city", { required: "City is required" })}
                      className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                        errors.city
                          ? "border-red-400 focus:border-red-600"
                          : "border-[#E2DFD8] focus:border-[#13110F]"
                      }`}
                    />
                    <label
                      htmlFor="city"
                      className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                        watchAllFields.city
                          ? "top-[-8px] text-[#13110F] text-[9px]"
                          : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                      }`}
                    >
                      City *
                    </label>
                    {errors.city && (
                      <span
                        className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                        role="alert"
                      >
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="relative flex flex-col pt-3 group">
                    <input
                      id="postalCode"
                      type="text"
                      placeholder=" "
                      {...register("postalCode", {
                        required: "Postal code is required",
                      })}
                      className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                        errors.postalCode
                          ? "border-red-400 focus:border-red-600"
                          : "border-[#E2DFD8] focus:border-[#13110F]"
                      }`}
                    />
                    <label
                      htmlFor="postalCode"
                      className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                        watchAllFields.postalCode
                          ? "top-[-8px] text-[#13110F] text-[9px]"
                          : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                      }`}
                    >
                      Postal Code *
                    </label>
                    {errors.postalCode && (
                      <span
                        className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                        role="alert"
                      >
                        {errors.postalCode.message}
                      </span>
                    )}
                  </div>

                  {/* Country */}
                  <div className="relative flex flex-col pt-3 group">
                    <input
                      id="country"
                      type="text"
                      placeholder=" "
                      {...register("country", {
                        required: "Country is required",
                      })}
                      className={`peer w-full bg-transparent border-b py-2 text-sm text-[#13110F] focus:outline-none transition-colors duration-300 placeholder-transparent min-h-[44px] ${
                        errors.country
                          ? "border-red-400 focus:border-red-600"
                          : "border-[#E2DFD8] focus:border-[#13110F]"
                      }`}
                    />
                    <label
                      htmlFor="country"
                      className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase font-medium tracking-[0.15em] text-[10px] ${
                        watchAllFields.country
                          ? "top-[-8px] text-[#13110F] text-[9px]"
                          : "top-3 text-[#72706F] text-xs peer-focus:top-[-8px] peer-focus:text-[9px] peer-focus:text-[#13110F]"
                      }`}
                    >
                      Country *
                    </label>
                    {errors.country && (
                      <span
                        className="text-[10px] text-red-600 font-medium mt-1.5 tracking-wide"
                        role="alert"
                      >
                        {errors.country.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Save Info Option with premium custom checkbox */}
                <div className="flex items-center gap-3 pt-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        {...register("saveInfo")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 border transition-colors duration-300 flex items-center justify-center ${
                          watchAllFields.saveInfo
                            ? "bg-[#1A1A1A] border-[#1A1A1A]"
                            : "bg-transparent border-[#E2DFD8]"
                        }`}
                      >
                        {watchAllFields.saveInfo && (
                          <Check
                            size={10}
                            className="text-[#FDFAF4]"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                    <span className="font-inter text-[11px] text-[#72706F] hover:text-[#13110F] tracking-wide transition-colors">
                      Save shipping details to my AEVUM account for future
                      purchases
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Section 2: Payment Method */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#E2DFD8] pb-3 mb-6">
                  <span className="font-cormorant text-xl font-light italic text-[#72706F]">
                    02.
                  </span>
                  <h3 className="font-inter text-xs font-semibold text-[#13110F] tracking-[0.2em] uppercase">
                    Payment Method
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cash On Delivery */}
                  <label
                    className={`relative border p-6 flex items-start gap-4 cursor-pointer transition-all duration-300 rounded-none select-none ${
                      watchPaymentMethod === "cash_on_delivery"
                        ? "border-[#13110F] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
                        : "border-[#E2DFD8] bg-[#FDFAF4]/40 hover:border-[#13110F]/45"
                    }`}
                  >
                    <input
                      type="radio"
                      value="cash_on_delivery"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />

                    {/* Custom radio circle */}
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                        watchPaymentMethod === "cash_on_delivery"
                          ? "border-[#13110F]"
                          : "border-[#E2DFD8]"
                      }`}
                    >
                      {watchPaymentMethod === "cash_on_delivery" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#13110F]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-inter text-[11px] font-bold text-[#13110F] uppercase tracking-[0.15em] flex items-center gap-2">
                        <Truck size={14} strokeWidth={1.5} />
                        Hand Delivery (COD)
                      </span>
                      <span className="font-inter text-[11px] font-light text-[#72706F] mt-2.5 leading-relaxed">
                        Settle the invoice via cash or digital terminal upon
                        white-glove arrival at your threshold.
                      </span>
                    </div>
                  </label>

                  {/* Advance Payment */}
                  <label
                    className={`relative border p-6 flex items-start gap-4 cursor-pointer transition-all duration-300 rounded-none select-none ${
                      watchPaymentMethod === "advance_payment"
                        ? "border-[#13110F] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
                        : "border-[#E2DFD8] bg-[#FDFAF4]/40 hover:border-[#13110F]/45"
                    }`}
                  >
                    <input
                      type="radio"
                      value="advance_payment"
                      {...register("paymentMethod")}
                      className="sr-only"
                    />

                    {/* Custom radio circle */}
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-300 shrink-0 ${
                        watchPaymentMethod === "advance_payment"
                          ? "border-[#13110F]"
                          : "border-[#E2DFD8]"
                      }`}
                    >
                      {watchPaymentMethod === "advance_payment" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#13110F]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-inter text-[11px] font-bold text-[#13110F] uppercase tracking-[0.15em] flex items-center gap-2">
                        <Landmark size={14} strokeWidth={1.5} />
                        Digital Transaction
                      </span>
                      <span className="font-inter text-[11px] font-light text-[#72706F] mt-2.5 leading-relaxed">
                        Secure transfer utilizing major international credit
                        cards or mobile bank gateways.
                      </span>

                      {/* Minimalist Payment Gateways Icons to convey premium quality */}
                      <div className="flex items-center gap-3 mt-3 opacity-60">
                        <span className="text-[8px] font-bold tracking-widest text-[#72706F] border border-[#E2DFD8] px-1 py-0.5 uppercase">
                          Visa
                        </span>
                        <span className="text-[8px] font-bold tracking-widest text-[#72706F] border border-[#E2DFD8] px-1 py-0.5 uppercase">
                          MC
                        </span>
                        <span className="text-[8px] font-bold tracking-widest text-[#72706F] border border-[#E2DFD8] px-1 py-0.5 uppercase">
                          Amex
                        </span>
                        <span className="text-[8px] font-bold tracking-widest text-[#72706F] border border-[#E2DFD8] px-1 py-0.5 uppercase">
                          Bkash
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] hover:bg-[#2C2A29] text-[#FDFAF4] py-4 text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-300 mt-8 active:scale-[0.99] flex items-center justify-center gap-2 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 disabled:bg-[#9B9694] disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    PROCESSING TRANSACTION...
                  </>
                ) : (
                  <>
                    <Lock size={12} className="mr-1" />
                    PLACE ORDER • ৳{total.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Right Column: Order Summary & Promo Code (5 Cols) ── */}
          <div className="lg:col-span-5 bg-white border border-[#E2DFD8] p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-cormorant text-2xl font-light text-[#13110F] border-b border-[#E2DFD8] pb-4 mb-6">
              Reservation Summary
            </h2>

            {/* Items List */}
            <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
              {checkoutItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-[#F6F6F6] border border-[#E2DFD8] shrink-0 overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={item.image || perfumeImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow">
                    <span className="font-inter text-[9px] font-semibold text-[#72706F] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="font-cormorant text-sm font-medium text-[#13110F] line-clamp-1 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-inter text-[10px] text-[#72706F]">
                        Qty: {item.quantity || 1}
                      </span>
                      {item.size && (
                        <span className="font-inter text-[10px] text-[#72706F]">
                          | Size: {item.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="font-cormorant text-sm text-[#13110F] font-semibold">
                    {typeof item.price === "number"
                      ? `৳${item.price}`
                      : item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Coupon Input Section */}
            <div className="border-t border-[#E2DFD8] pt-6 mt-6">
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label
                    htmlFor="promo"
                    className="block font-inter text-[10px] font-semibold tracking-wider text-[#72706F] uppercase"
                  >
                    Promo Code or Gift Card
                  </label>
                  <div className="flex gap-3">
                    <div className="relative grow">
                      <input
                        id="promo"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="E.g. AEVUMWELCOME"
                        className="w-full bg-[#FAF9F6] border border-[#E2DFD8] px-3 py-2 text-xs text-[#13110F] focus:outline-none focus:border-[#13110F] transition-all min-h-[38px] placeholder-gray-300 uppercase tracking-widest font-medium"
                      />
                      {promoError && (
                        <span className="block text-[9px] text-red-600 mt-1 font-medium">
                          {promoError}
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingPromo || !promoInput.trim()}
                      className="px-4 bg-[#13110F] text-[#FDFAF4] hover:bg-[#2C2A29] text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 min-h-[38px] disabled:bg-[#9B9694] disabled:cursor-not-allowed"
                    >
                      {isApplyingPromo ? "..." : "Apply"}
                    </button>
                  </div>
                  <p className="text-[9px] text-[#72706F] font-light leading-relaxed">
                    Enter{" "}
                    <strong className="text-[#13110F]">AEVUMWELCOME</strong> for
                    10% off. Only one coupon may be applied per transaction.
                  </p>
                </form>
              ) : (
                <div className="bg-[#FAF9F6] border border-[#E2DFD8] p-3 flex items-center justify-between transition-all">
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="text-emerald-700" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#13110F]">
                        {appliedPromo}
                      </span>
                      <span className="text-[9px] text-[#72706F]">
                        Atelier discount applied (-10%)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[9px] font-semibold tracking-widest text-[#72706F] hover:text-red-600 uppercase border-b border-[#72706F] hover:border-red-600 pb-0.5 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-[#E2DFD8] pt-6 mt-6 space-y-3">
              <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                <span className="font-light">Subtotal</span>
                <span className="font-cormorant font-semibold text-sm text-[#13110F]">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                  <span className="font-light flex items-center gap-1.5">
                    <Sparkles size={11} className="text-amber-600" />
                    Discount
                  </span>
                  <span className="font-cormorant font-semibold text-sm text-amber-700">
                    -৳{promoDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                <span className="font-light">Shipping</span>
                <span className="text-emerald-700 uppercase font-semibold tracking-widest text-[9px] flex items-center gap-1.5">
                  Complimentary
                </span>
              </div>
              <div className="w-full h-px bg-[#E2DFD8] my-2" />
              <div className="flex justify-between items-center text-sm font-semibold font-inter text-[#13110F] uppercase tracking-wider">
                <span>Grand Total</span>
                <span className="font-cormorant text-lg font-bold">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Atelier Safety Guarantee */}
            <div className="mt-8 border border-[#E2DFD8] p-4 bg-[#FAF9F6] font-inter space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={15}
                  className="text-[#13110F] mt-0.5 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#13110F] uppercase tracking-wider">
                    Secured Transaction
                  </span>
                  <span className="text-[9px] text-[#72706F] leading-relaxed mt-1 font-light">
                    AEVUM handles processing via bank-grade SSL layers to
                    encrypt user credentials securely.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HelpCircle
                  size={15}
                  className="text-[#13110F] mt-0.5 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#13110F] uppercase tracking-wider">
                    Assistance Services
                  </span>
                  <span className="text-[9px] text-[#72706F] leading-relaxed mt-1 font-light">
                    For customized inquiry, please contact Client Concierge at{" "}
                    <strong className="text-[#13110F]">
                      concierge@aevum.com
                    </strong>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
