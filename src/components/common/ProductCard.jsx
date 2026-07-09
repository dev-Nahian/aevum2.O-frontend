import { Link } from "react-router-dom";
import { Heart, Sparkles, X, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductCard({ 
    product, 
    variant = "default", 
    onRemove, 
    onAddToBag, 
    onPersonalize 
}) {
    // ✅ Local state for visual feedback (in production, lift to Context/API)
    const [isWishlisted, setIsWishlisted] = useState(true);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Detect touch devices for hover fallback
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted((prev) => !prev);
        
        // TODO: Sync with backend/wishlist context
        // dispatch({ type: 'TOGGLE_WISHLIST', productId: product.id });
    };

    if (variant === "wishlist") {
        return (
            <Link
                to={`/product/${product.id}`}
                state={{ data: product }}
                className="group relative flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2A29]/30 rounded-sm"
                aria-label={`View details for ${product.title}`}
            >
                {/* Image Wrapper */}
                <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-[#F6F6F6] border border-[#E5E2DA] w-full">
                    {/* Product Image */}
                    <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />

                    {/* Top Left: Personalization / Sparkles Icon */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onPersonalize) {
                                onPersonalize(product.id);
                            } else {
                                console.log("Personalize product:", product.id);
                            }
                        }}
                        aria-label="Personalize item"
                        className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center bg-white hover:bg-gray-50 rounded-sm shadow-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                    >
                        <Sparkles size={14} className="text-[#1A1A1A]" />
                    </button>

                    {/* Top Right: Close / Remove Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onRemove) {
                                onRemove(product.id);
                            }
                        }}
                        aria-label={`Remove ${product.title} from wishlist`}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#72706F] hover:text-[#1A1A1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                    >
                        <X size={18} />
                    </button>

                    {/* Bottom Left: Title */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
                        <span className="font-inter text-xs sm:text-sm font-semibold text-[#1A1A1A] tracking-wide">
                            {product.title}
                        </span>
                    </div>

                    {/* Bottom Right: Shopping Bag Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onAddToBag) {
                                onAddToBag(product.id);
                            }
                        }}
                        aria-label={`Add ${product.title} to bag`}
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 p-2.5 min-w-[38px] min-h-[38px] flex items-center justify-center bg-black/[0.06] hover:bg-black/80 hover:text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                    >
                        <ShoppingBag size={14} />
                    </button>
                </div>
            </Link>
        );
    }

    // Default variant
    return (
        <Link
            to={`/product/${product.id}`}
            state={{ data: product }}
            className="group flex flex-col w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2A29]/30 rounded-sm"
            aria-label={`View details for ${product.title}`}
        >
            {/* Image Wrapper */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EFE8] border border-[#E5E2DA]">
                {/* Product Image */}
                <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Wishlist Button - Always visible on touch, hover-reveal on desktop */}
                <button
                    onClick={toggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-pressed={isWishlisted}
                    className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 ${
                        isTouchDevice 
                            ? "opacity-100 translate-y-0" 
                            : "opacity-0 translate-y-[-4px] group-hover:opacity-100 group-hover:translate-y-0"
                    }`}
                >
                    <Heart
                        size={16}
                        className={`transition-all duration-300 ${
                            isWishlisted
                                ? "fill-[#D32F2F] text-[#D32F2F] scale-110"
                                : "text-[#2C2A29] hover:text-[#D32F2F]"
                        }`}
                    />
                </button>

                {/* Quick View Panel - Hidden on touch, hover-reveal on desktop */}
                {!isTouchDevice && (
                    <div className="absolute bottom-0 left-0 w-full bg-[#FAF9F6] py-3 sm:py-3.5 text-center border-t border-[#E5E2DA] transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
                        <span className="font-inter text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#2C2A29] uppercase">
                            QUICK VIEW
                        </span>
                    </div>
                )}

                {/* Mobile: Add subtle tap indicator */}
                {isTouchDevice && (
                    <div className="absolute inset-0 bg-black/0 group-active:bg-black/5 transition-colors duration-150 pointer-events-none" />
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col items-center text-center mt-4 sm:mt-5 px-2">
                <span className="font-inter text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#72706F] uppercase mb-1">
                    {product.category}
                </span>
                <h3 className="font-cormorant text-base sm:text-[16px] md:text-[18px] font-medium text-[#1A1A1A] tracking-[0.01em] leading-tight">
                    {product.title}
                </h3>
                <span className="font-cormorant text-[13px] sm:text-[14px] md:text-[15px] text-[#72706F] mt-1">
                    {product.price}
                </span>
            </div>
        </Link>
    );
}     