import background from "@/assets/Images/timeless.png";
import Container from "@/components/common/Container";
import { Link } from "react-router-dom";

export default function HomeShowcase() {
    return (
        <section
            className="relative min-h-[100dvh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{ backgroundImage: `url(${background})` }}
        >
            {/* Subtle overlay for text legibility & premium luxury feel */}
            <div className="absolute inset-0 bg-black/24 pointer-events-none z-0" />

            <Container className="relative z-10 flex flex-col justify-center px-4 py-16 sm:py-20 md:py-24">
                <div className="max-w-[743px]">
                    {/* Collection subtitle */}
                    <p className="font-inter text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] text-white/90 uppercase mb-3 sm:mb-4 select-none">
                        THE HOUSE OF AEVUM
                    </p>

                    {/* Main Heading */}
                    <h2
                        className="font-cormorant text-[32px] sm:text-[40px] md:text-[52px] lg:text-[58px] leading-[1.15] font-medium text-white tracking-[0.02em] mb-5 sm:mb-6 md:mb-8"
                        style={{ textShadow: "0 0 64px rgba(0, 0, 0, 0.25)" }}
                    >
                        Where Timeless Elegance Meets Modern Luxury
                    </h2>

                    {/* Paragraph */}
                    <p className="font-inter text-sm sm:text-base text-white/80 max-w-[700px] mb-8 sm:mb-10 md:mb-12 font-light tracking-wide">
                        AEVUM was created to bring together refined fashion, elevated essentials, and signature fragrances into one sophisticated destination. Inspired by quiet luxury and timeless craftsmanship, every collection reflects confidence, elegance, and contemporary style.
                    </p>

                    {/* Button */}
                    <Link
                        to="/store" // ⚠️ Update to your actual shop/collection route
                        className="inline-flex items-center justify-center font-inter text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] text-white uppercase border border-white/30 hover:border-white px-7 sm:px-8 py-3 sm:py-[15px] rounded-none bg-transparent hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[44px]"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </Container>
        </section>
    );
}