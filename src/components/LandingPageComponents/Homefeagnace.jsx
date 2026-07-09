import { Link } from "react-router-dom";
import Container from "../common/Container";
import perfumeShowcase from "@/assets/Images/perfumeShowcase.jpg";

export default function HomeFragrance() {
    const notes = [
        "Woody",
        "Floral",
        "Musk",
        "Oud",
        "Citrus",
        "Amber"
    ];

    return (
        <section className="bg-[#FDFAF4] py-16 sm:py-20 md:py-24 lg:py-28 select-none overflow-hidden">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-5 flex flex-col items-start">
                        <span className="font-inter text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#72706F] uppercase block mb-3 sm:mb-4">
                            LES PARFUMS AEVUM
                        </span>
                        
                        <h2 className="font-cormorant text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.15] font-medium text-[#1A1A1A] tracking-[0.01em] mb-5 md:mb-6">
                            Discover the Scent of AEVUM
                        </h2>
                        
                        <p className="font-inter text-sm md:text-base leading-relaxed text-[#72706F] font-light tracking-wide mb-8 md:mb-10 max-w-[95%] lg:max-w-[480px]">
                            A signature olfactive trilogy — composed of rare oud, Bulgarian rose, ambergris, and bergamot. Cinematic. Sensual. Eternal.
                        </p>

                        {/* Fragrance Notes Grid */}
                        <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-6 sm:gap-x-10 mb-10 md:mb-12 w-full max-w-[360px]">
                            {notes.map((note, idx) => (
                                <div key={idx} className="flex items-center text-[#72706F]">
                                    <span className="font-light mr-2 sm:mr-3 text-base sm:text-[14px]">—</span>
                                    <span className="font-inter text-xs sm:text-sm tracking-[0.05em] font-light">
                                        {note}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <Link 
                            to="/category/perfumes"
                            className="inline-flex items-center justify-center font-inter text-[11px] sm:text-xs font-medium tracking-[0.2em] text-[#1A1A1A] uppercase border border-[#2C2A29]/30 hover:border-[#1A1A1A] px-7 sm:px-8 py-3 sm:py-[15px] rounded-none bg-transparent hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30"
                        >
                            EXPLORE FRAGRANCES
                        </Link>
                    </div>

                    {/* Right Column: Image */}
                    <div className="lg:col-span-7 w-full">
                        <div className="relative aspect-[4/5] sm:aspect-[4/3] w-full overflow-hidden bg-[#F2EFE8] border border-[#E5E2DA] group">
                            {/* Inner Image Zoom Hover */}
                            <img
                                src={perfumeShowcase}
                                alt="AEVUM luxury fragrance collection"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                            />
                            {/* Premium overlay shimmer effect on hover */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}