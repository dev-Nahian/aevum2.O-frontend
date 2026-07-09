import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/common/Container";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "@/Redux/cartSlice";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // Helper to parse price string or number safely
  const parsePrice = (priceVal) => {
    if (typeof priceVal === "number") return priceVal;
    if (typeof priceVal === "string") {
      return parseFloat(priceVal.replace(/[^0-9.]/g, "")) || 0;
    }
    return 0;
  };

  // Increment item count
  const handleIncrement = (id, size, title) => {
    dispatch(incrementQuantity({ id, size }));
  };

  // Decrement item count
  const handleDecrement = (id, size, quantity, title) => {
    if (quantity > 1) {
      dispatch(decrementQuantity({ id, size }));
    } else {
      // Prompt removal if user decreases count at 1
      handleRemove(id, size, title);
    }
  };

  // Remove single item
  const handleRemove = (id, size, title) => {
    dispatch(removeFromCart({ id, size }));
    toast.success(`Removed ${title} (${size}) from your bag`, {
      position: "bottom-center",
      style: {
        background: "#1A1A1A",
        color: "#FDFAF4",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        borderRadius: "0px",
        border: "1px solid #E2DFD8",
      },
    });
  };

  // Clear all items
  const handleClearAll = () => {
    dispatch(clearCart());
    toast.success("Bag cleared", {
      position: "bottom-center",
      style: {
        background: "#1A1A1A",
        color: "#FDFAF4",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        borderRadius: "0px",
        border: "1px solid #E2DFD8",
      },
    });
  };

  // Calculate cost calculations
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * item.quantity;
  }, 0);

  const shipping = 0; // Luxury atelier standard
  const total = subtotal + shipping;

  const isEmpty = cartItems.length === 0;

  // Navigate to checkout passing state
  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        fromCart: true,
        items: cartItems,
      },
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FDFAF4] min-h-screen text-[#13110F]">
      <Container>
        {/* Header Section */}
        <div className="w-full py-10 text-center px-4 mb-8 sm:mb-12 border-b border-[#E2DFD8]/60">
          <h1 className="font-cormorant text-3xl sm:text-[38px] md:text-[44px] lg:text-[50px] font-light text-[#13110F] tracking-[0.02em] leading-tight mb-4">
            Shopping Bag selection
          </h1>
          <p className="font-inter text-xs sm:text-sm text-[#72706F] tracking-widest uppercase font-light">
            Review your carefully curated pieces before checkout
          </p>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 bg-white border border-[#E2DFD8] p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-6 border border-[#E2DFD8]">
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
                className="text-[#72706F]"
              />
            </div>

            <h2 className="font-cormorant text-2xl md:text-3xl font-light text-[#13110F] mb-3">
              Your bag is currently empty
            </h2>

            <p className="font-inter text-xs text-[#72706F] max-w-[340px] mb-8 font-light leading-relaxed">
              Explore Aevum's exquisite selection of masterfully designed
              fragrances and discover items that speak to you.
            </p>

            <Link
              to="/category/perfumes"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#2C2A29] transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Header row for list on desktop */}
              <div className="hidden md:grid grid-cols-12 pb-4 border-b border-[#E2DFD8] text-[9px] font-semibold tracking-[0.25em] text-[#72706F] uppercase px-4">
                <div className="col-span-6">Product details</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items List Rows */}
              <div className="divide-y divide-[#E2DFD8]/80 border-b border-[#E2DFD8]">
                {cartItems.map((item, index) => {
                  const unitPriceVal = parsePrice(item.price);
                  const rowSubtotal = unitPriceVal * item.quantity;

                  return (
                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 px-2 sm:px-4 items-center bg-white/40 hover:bg-white/95 transition-all duration-300 relative group"
                    >
                      {/* Image + Info details */}
                      <div className="col-span-1 md:col-span-6 flex gap-4 sm:gap-6 items-center">
                        <div className="w-20 h-24 bg-[#FAF9F6] border border-[#E2DFD8] p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="block font-inter text-[9px] font-bold text-[#72706F] tracking-widest uppercase">
                            {item.category}
                          </span>
                          <h3 className="font-cormorant text-[16px] sm:text-lg text-[#13110F] font-medium leading-snug">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-[#72706F] font-inter font-light">
                            <span>
                              Size: <strong>{item.size}</strong>
                            </span>
                            <span>|</span>
                            <span>Authentic luxury guarantee</span>
                          </div>

                          {/* Mobile-only Unit Price Display */}
                          <div className="md:hidden flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-[#72706F]">
                              Price:
                            </span>
                            <span className="font-cormorant text-xs font-semibold">
                              ${unitPriceVal}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Unit Price (2 cols) */}
                      <div className="hidden md:block col-span-2 text-center">
                        <span className="font-cormorant text-sm text-[#13110F] font-semibold">
                          ${unitPriceVal}
                        </span>
                      </div>

                      {/* Quantity Selector (2 cols) */}
                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                        <div className="flex items-center border border-[#E2DFD8] bg-white">
                          <button
                            onClick={() =>
                              handleDecrement(
                                item.id,
                                item.size,
                                item.quantity,
                                item.title,
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#72706F] hover:bg-[#F8F2EB] hover:text-[#13110F] transition-colors min-w-[32px] focus:outline-none"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-[#13110F] text-xs font-inter font-medium border-l border-r border-[#E2DFD8]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncrement(item.id, item.size, item.title)
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#72706F] hover:bg-[#F8F2EB] hover:text-[#13110F] transition-colors min-w-[32px] focus:outline-none"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Row Subtotal & Trash button (2 cols) */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                        {/* Mobile subtotal label */}
                        <span className="md:hidden text-[10px] text-[#72706F] font-inter uppercase">
                          Subtotal
                        </span>

                        <div className="flex items-center gap-4">
                          <span className="font-cormorant text-base text-[#13110F] font-semibold">
                            ${rowSubtotal.toLocaleString()}
                          </span>

                          {/* Trash button */}
                          <button
                            onClick={() =>
                              handleRemove(item.id, item.size, item.title)
                            }
                            className="p-1 text-[#72706F] hover:text-red-600 transition-colors focus:outline-none"
                            aria-label={`Remove ${item.title} from bag`}
                          >
                            <Trash2 size={14} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action utilities beneath items list */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  to="/category/perfumes"
                  className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-inter font-medium tracking-[0.15em] text-[#72706F] hover:text-[#13110F] uppercase transition-colors"
                >
                  <ArrowLeft size={13} />
                  Continue Selection
                </Link>
                <button
                  onClick={handleClearAll}
                  className="font-inter text-[10px] font-medium tracking-[0.15em] text-[#72706F] uppercase hover:text-red-600 transition-colors pb-0.5 border-b border-transparent hover:border-red-600/30"
                >
                  Clear entire bag
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary Box (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#E2DFD8] p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
              <h2 className="font-cormorant text-2xl font-light text-[#13110F] border-b border-[#E2DFD8] pb-4 mb-6">
                Selection Summary
              </h2>

              <div className="space-y-4">
                {/* Cost rows */}
                <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                  <span className="font-light">Subtotal</span>
                  <span className="font-cormorant font-semibold text-sm text-[#13110F]">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                  <span className="font-light">Shipping</span>
                  <span className="text-emerald-700 uppercase font-semibold tracking-widest text-[9px] flex items-center gap-1">
                    <Sparkles size={10} />
                    Complimentary
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-inter text-[#72706F]">
                  <span className="font-light">Atelier Import Fees</span>
                  <span className="text-[#13110F] font-light">Included</span>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#E2DFD8] my-4" />

                {/* Grand Total */}
                <div className="flex justify-between items-center text-sm font-semibold font-inter text-[#13110F] uppercase tracking-wider">
                  <span>Estimated Total</span>
                  <span className="font-cormorant text-xl font-bold">
                    ${total.toLocaleString()}
                  </span>
                </div>

                <p className="text-[10px] text-[#72706F] font-light leading-relaxed pt-2">
                  Promo codes or custom vip codes can be applied during the
                  final billing & payment section.
                </p>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A1A1A] hover:bg-[#2C2A29] text-[#FDFAF4] py-4 text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-300 mt-8 active:scale-[0.99] flex items-center justify-center gap-2 min-h-[48px] focus:outline-none"
              >
                PROCEED TO CHECKOUT
                <ArrowRight size={12} />
              </button>

              {/* Atelier Safety Guarantee */}
              <div className="mt-8 border border-[#E2DFD8] p-4 bg-[#FAF9F6] font-inter">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={16}
                    className="text-[#13110F] mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#13110F] uppercase tracking-wider">
                      Maison Guarantee
                    </span>
                    <span className="text-[9px] text-[#72706F] leading-relaxed mt-1 font-light">
                      Each order arrives signature packed in our classic atelier
                      box. Premium courier delivery features climate control for
                      pristine product conservation.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
