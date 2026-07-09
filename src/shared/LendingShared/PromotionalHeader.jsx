import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PromotionalHeader() {
    const [isDark, setIsDark] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        setIsDark(path.includes("/wishlist") || path.includes("/product/") || path.includes("/auth") || path.includes("/about") || path.includes("/category/new-arrivals"));
    }, [location]);


    return (
        <section
            className={`w-full border-b transition-colors duration-300 ${
                isDark
                    ? "relative z-30 border-black/5"
                    : "absolute top-0 left-0 right-0 z-30 border-white/25"
            }`}
        >
            {/* Flex container replaces rigid leading-10 for reliable vertical centering */}
            <div className="flex items-center justify-center h-10 px-2 sm:px-4">
                <p className={`text-[11px] sm:text-sm font-inter tracking-wide text-center leading-tight ${
                    isDark ? "text-black/60" : "text-white/90"
                }`}>
                    Complimentary Shipping on orders over 1500 Tk
                </p>
            </div>
        </section>
    );
}