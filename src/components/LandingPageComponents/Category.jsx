import { Link } from "react-router-dom";
import Container from "../common/Container";
import manImage from "@/assets/Images/man.png";
import womenImage from "@/assets/Images/women.png";
import perfumeImage from "@/assets/Images/perfume.png";

export default function Category() {
    const categories = [
        {
            subtitle: "TIMELESS TAILORING",
            title: "For Him",
            image: manImage,
            link: "/category/men",
        },
        {
            subtitle: "Luxury Womenswear",
            title: "For Her",
            image: womenImage,
            link: "/category/women",
        },
        {
            subtitle: "SIGNATURE FRAGRANCE",
            title: "Fragrance",
            image: perfumeImage,
            link: "/category/perfumes",
        },
    ];

    return (
        <section className="bg-[#FDFAF4] py-16 sm:py-20 md:py-28 select-none">
            <Container>
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="font-inter text-[11px] md:text-[12px] font-semibold tracking-[0.3em] text-[#72706F] uppercase block mb-3">
                        THE HOUSE OF AEVUM
                    </span>
                    <h2 className="font-cormorant text-[32px] sm:text-[40px] md:text-[52px] leading-tight font-medium text-[#1A1A1A] tracking-[0.02em]">
                        Three Worlds, One Aesthetic
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={cat.link}
                            className="group relative block aspect-[4/5] overflow-hidden bg-[#F5F4F1] border border-[#E5E2DA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#72706F]/50 rounded-sm"
                            aria-label={`Explore ${cat.title} collection`}
                        >
                            {/* Image Container with Zoom effect */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <img
                                    src={cat.image}
                                    alt={`${cat.title} luxury collection`}
                                    loading={idx === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            </div>

                            {/* Luxury Dark Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/70 group-hover:via-black/25" />

                            {/* Content Block (Bottom Left) */}
                            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-10 flex flex-col items-start z-10">
                                <span className="font-inter text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-white/80 uppercase mb-2">
                                    {cat.subtitle}
                                </span>

                                <h3 className="font-cormorant text-2xl sm:text-[32px] md:text-[38px] font-light text-white mb-4 leading-tight tracking-[0.02em]">
                                    {cat.title}
                                </h3>

                                <div className="inline-block relative">
                                    <span className="font-inter text-[11px] font-semibold tracking-[0.25em] text-white uppercase pb-1.5 block">
                                        DISCOVER
                                    </span>
                                    {/* Animated Underline */}
                                    <span className="absolute bottom-0 left-0 w-8 h-[1px] bg-white transition-all duration-300 ease-out group-hover:w-full" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}