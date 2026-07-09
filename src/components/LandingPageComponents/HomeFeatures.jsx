import Marquee from "react-fast-marquee";

export default function HomeFeatures() {
    const features = [
        "SINCE 2026",
        "MAISON DE COUTURE",
        "CRAFTED IN BANGLADESH",
        "FREE DELIVERY IN DHAKA",
    ];

    return (
        <section
            className="w-full bg-[#FDFAF4] border-y border-[#E5E2DA] py-4 sm:py-5 overflow-hidden"
            aria-label="Brand highlights"
        >
            <Marquee
                speed={40}
                gradient={false}
                pauseOnHover={true}
                autoFill={true}
                className="flex items-center select-none"
            >
                {features.map((item, index) => (
                    <div key={index} className="flex items-center px-6 sm:px-10 md:px-14 lg:px-16">
                        <span className="font-inter text-[11px] sm:text-xs md:text-[12px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase whitespace-nowrap">
                            {item}
                        </span>
                        <span
                            className="text-[#72706F]/30 text-[10px] sm:text-xs ml-8 sm:ml-12 md:ml-16 lg:ml-24 select-none"
                            aria-hidden="true"
                        >
                            •
                        </span>
                    </div>
                ))}
            </Marquee>
        </section>
    );
}