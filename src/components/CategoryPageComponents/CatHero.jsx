import backgroundMen from "@/assets/Images/MenHeroBg.png";
import backgroundWomen from "@/assets/Images/WomenHeroBg.png";
import backgroundPerfumes from "@/assets/Images/PerfumeHeroBg.png";
import backgroundStore from "@/assets/Images/HeroBanner2.jpg";
import Container from "@/components/common/Container";
import { useState, useEffect } from "react";

// Background mapping for cleaner logic
const BACKGROUND_MAP = {
    men: backgroundMen,
    women: backgroundWomen,
    perfumes: backgroundPerfumes,
    store: backgroundStore,
};

// Title mapping for cleaner logic
const TITLE_MAP = {
    men: "For Him",
    women: "For Her",
    perfumes: "Fragrances",
    store: "Our Boutique",
};

export default function CatHero({ slug }) {
    const [currentTitle, setCurrentTitle] = useState(TITLE_MAP[slug] || "Collection");
    const [currentBackground, setCurrentBackground] = useState(BACKGROUND_MAP[slug] || backgroundMen);

    useEffect(() => {
        if (BACKGROUND_MAP[slug]) {
            setCurrentTitle(TITLE_MAP[slug]);
            setCurrentBackground(BACKGROUND_MAP[slug]);
        }
    }, [slug]);

    return (
        <section
            className="relative min-h-[60dvh] flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{ backgroundImage: `url(${currentBackground})` }}
        >
            {/* Subtle overlay for text legibility & premium luxury feel */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none z-0" />

            <Container className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20">
                {/* Main Heading */}
                <h2
                    className="font-cormorant text-[32px] sm:text-[44px] md:text-[60px] lg:text-[88px] leading-[1.15] font-medium text-white max-w-[90%] md:max-w-[787px] mx-auto tracking-[0.5px] sm:tracking-[0.88px]"
                    style={{ textShadow: "0 0 64px rgba(0, 0, 0, 0.25)" }}
                >
                    {currentTitle}
                </h2>
            </Container>
        </section>
    );
}