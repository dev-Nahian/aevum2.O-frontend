import React from "react";
import aboutBanner from "@/assets/Images/aboutBanner.png";

export default function AboutMainBanner() {
  return (
    <section className="w-full bg-[#FAF9F5] overflow-hidden">
      {/* Responsive Banner Container */}
      <div 
        className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] min-h-[200px] sm:min-h-[250px] md:min-h-[300px] max-h-[40vh] sm:max-h-[50vh] md:max-h-[750px] border-b border-[#E5E2DA]"
        role="img"
        aria-label="AEVUM Maison atelier showcase"
      >
        {/* Background Image */}
        <img
          src={aboutBanner}
          alt="Aevum Maison Banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />

        {/* Optional: Subtle Gradient Overlay for Future Text Placement */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Optional: Caption/Tagline Area (Hidden by Default - Uncomment to Use) */}
        {/* 
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12 text-white z-10">
          <p className="font-inter text-xs sm:text-sm tracking-[0.2em] uppercase text-white/90 mb-2">
            THE MAISON
          </p>
          <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-normal text-white leading-tight">
            A Quiet Pursuit of the Eternal
          </h2>
        </div> 
        */}
      </div>
    </section>
  );
}