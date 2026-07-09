import React from "react";
import Container from "@/components/common/Container";

export default function AboutDescription() {
  const details = [
    {
      label: "ORIGIN",
      text: "Founded by a small circle of designers, perfumers, and tailors devoted to material and proportion.",
    },
    {
      label: "ATELIER",
      text: "Garments are constructed in our European workshops, in collaboration with mills and tanneries that have served the great houses for generations.",
    },
    {
      label: "OLFACTIVE",
      text: "Our perfumes are composed in Grasse, using rare naturals — Bulgarian rose, oud, ambergris, neroli — sourced through long-standing partnerships.",
    },
    {
      label: "ADDRESS",
      text: "12 Rue du Faubourg Saint-Honoré, 75008 Paris, France. By appointment only.", // ✅ Fixed duplicate text
    },
  ];

  return (
    <section className="bg-[#FAF9F5] py-12 sm:py-16 md:py-20 lg:py-24">
      <Container>
        {/* ✅ Clean border logic: top border on container, divide-y between items */}
        <div className="max-w-4xl mx-auto divide-y divide-[#E5E2DA] border-t border-[#E5E2DA]">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-6 md:py-8 items-start"
            >
              {/* Label */}
              <div className="md:col-span-4">
                <span className="font-inter text-[10px] sm:text-xs md:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase">
                  {item.label}
                </span>
              </div>

              {/* Description */}
              <div className="md:col-span-8">
                <p className="font-inter text-[13px] sm:text-sm md:text-[15px] text-[#72706F] font-normal leading-relaxed sm:leading-[1.7] md:leading-[1.8] tracking-[0.01em] sm:tracking-[0.02em]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}