import Container from "@/components/common/Container";

export default function HomeCommitment() {
    const commitments = [
        {
            subtitle: "THE PROMISE",
            title: "Bangladesh Atelier",
            description: "Crafted in our ateliers across Bangladesh, with rare materials sourced over generations."
        },
        {
            subtitle: "THE PROMISE",
            title: "Complimentary Service",
            description: "White-glove delivery, returns, and personal styling for every client of the Maison."
        },
        {
            subtitle: "THE PROMISE",
            title: "Lifetime Care",
            description: "Repair, restoration, and bespoke alterations offered for every AEVUM piece."
        }
    ];

    return (
        <section className="bg-[#F8F2EB] py-16 sm:py-20 md:py-24 lg:py-28 select-none">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
                    {commitments.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Subtitle */}
                            <span className="font-inter text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-[#72706F] uppercase mb-3">
                                {item.subtitle}
                            </span>

                            {/* Title */}
                            <h3 className="font-cormorant text-[24px] sm:text-[28px] md:text-[32px] leading-[1.15] font-medium text-[#1A1A1A] tracking-[0.01em] mb-4">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="font-inter text-[13px] sm:text-sm leading-relaxed text-[#72706F] font-light tracking-[0.02em] max-w-[260px] sm:max-w-[300px] md:max-w-[340px]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}