import background2 from "@/assets/Images/HeroBanner2.jpg";
import Container from "../common/Container";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section
            className="relative min-h-[100dvh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{ backgroundImage: `url(${background2})` }}
        >
            {/* Subtle overlay for text legibility & premium luxury feel */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none z-0"></div>

            <Container className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
                {/* Collection subtitle */}
                <p className="font-inter text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/90 uppercase mb-4 sm:mb-5 select-none">
                    SPRING • SUMMER COLLECTION 2026
                </p>

                {/* Main Heading */}
                <h1
                    className="font-cormorant text-[36px] sm:text-[48px] md:text-[64px] lg:text-[88px] leading-[1.15] font-medium text-white max-w-[90%] md:max-w-[787px] mx-auto mb-5 md:mb-6 tracking-[0.5px] sm:tracking-[0.88px]"
                    style={{ textShadow: "0 0 64px rgba(0, 0, 0, 0.25)" }}
                >
                    Timeless Luxury For The Modern Era
                </h1>

                {/* Description */}
                <p className="font-inter text-sm sm:text-base text-white/80 max-w-[600px] mx-auto mb-8 md:mb-12 font-light tracking-wide">
                    A curated world of fashion, elegance, and signature fragrance.
                </p>

                {/* 🔘 Responsive Button Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
                    
                    {/* 📱 Mobile Only: SHOP NOW Button */}
                    <Link
                        to="/shop" // ⚠️ Update this route to your main shop/collection page
                        className="sm:hidden w-full max-w-[320px] sm:w-auto sm:min-w-[200px] border border-white/30 hover:border-white px-8 py-[15px] text-[12px] font-medium tracking-[0.2em] text-white uppercase rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        SHOP NOW
                    </Link>

                    {/* 💻 Desktop/Tablet Only: 3 Category Buttons */}
                    {[
                        { label: "DISCOVER MEN", href: "/category/men" },
                        { label: "DISCOVER WOMEN", href: "/category/women" },
                        { label: "DISCOVER PERFUMES", href: "/category/perfumes" }
                    ].map((btn) => (
                        <Link
                            key={btn.href}
                            to={btn.href}
                            className="hidden sm:block w-full sm:w-auto min-w-[200px] border border-white/30 hover:border-white px-8 py-[15px] text-[12px] font-medium tracking-[0.2em] text-white uppercase rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            {btn.label}
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}