import React from "react";
import Container from "@/components/common/Container";

export default function AboutHeading() {
  return (
    <section className="bg-[#FAF9F5] py-16 sm:py-20 md:py-24 lg:py-32 text-center border-b border-[#E5E2DA]">
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col items-center px-4">
          {/* Subtitle */}
          <span className="font-inter text-[10px] sm:text-xs md:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#72706F] uppercase font-medium mb-4 sm:mb-5 md:mb-6">
            THE MAISON
          </span>

          {/* Heading */}
          <h1 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal text-[#13110F] leading-[1.15] tracking-[0.01em] sm:tracking-wide mb-6 sm:mb-7 md:mb-8 max-w-[90%] sm:max-w-2xl">
            A Quiet Pursuit of the Eternal
          </h1>

          {/* Paragraph */}
          <p className="font-inter text-[13px] sm:text-sm md:text-[15px] text-[#72706F] font-normal leading-relaxed sm:leading-[1.7] md:leading-[1.8] tracking-[0.02em] sm:tracking-[0.03em] md:tracking-[0.05em] max-w-[95%] sm:max-w-[680px] text-center">
            AEVUM — from the Latin for an age, a lifetime, eternity — is a contemporary house dedicated to the timeless. Established as an answer to a noisier era, the Maison composes objects of clothing, leather and scent intended to outlast their season.
          </p>
        </div>
      </Container>
    </section>
  );
}