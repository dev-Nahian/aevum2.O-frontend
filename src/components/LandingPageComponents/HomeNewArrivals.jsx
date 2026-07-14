import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "@/lib/apiClient";
import Container from "../common/Container";
import ProductCard from "../common/ProductCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// NEW ARRIVAL PRODUCTS JSON
const products = [];

export default function HomeNewArrivals() {
    const [dbProducts, setDbProducts] = useState([]);
    
    useEffect(() => {
        const fetchNewest = async () => {
            try {
                const data = await productAPI.getAll({ newest: "true" });
                setDbProducts(data.products || data);
            } catch (error) {
                console.error("Error fetching newest arrivals:", error);
            }
        };
        fetchNewest();

        const handleFocus = () => {
            fetchNewest();
        };
        window.addEventListener("focus", handleFocus);

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchNewest();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const displayProducts = dbProducts.length > 0 ? dbProducts : products;

    return (
        <section className="bg-[#F8F2EB] pb-8 sm:pb-20 md:pb-24 pt-12 sm:pt-16 md:pt-20 select-none">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-0 mb-8 sm:mb-10 border-b border-[#E5E2DA] pb-4 sm:pb-5">
                    <div>
                        <span className="font-inter text-[11px] md:text-[12px] font-semibold tracking-[0.3em] text-[#72706F] uppercase block mb-2">
                            NEW ARRIVALS
                        </span>
                        <h2 className="font-cormorant text-[28px] sm:text-[36px] md:text-[48px] leading-none font-medium text-[#1A1A1A] tracking-[0.02em]">
                            The Latest Edit
                        </h2>
                    </div>
                    <Link
                        to="/store"
                        className="group/link flex items-center relative pb-1 mb-1 transition-all duration-300 self-start sm:self-auto"
                    >
                        <span className="font-inter text-[11px] font-semibold tracking-[0.2em] text-[#2C2A29] uppercase">
                            VIEW ALL
                        </span>
                        <span className="absolute bottom-0 left-0 w-8 h-[1px] bg-[#2C2A29] transition-all duration-300 ease-out group-hover/link:w-full" />
                    </Link>
                </div>

                {/* Products Swiper */}
                <div className="relative">
                    <Swiper
                        spaceBetween={16}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: { slidesPerView: 2.2, spaceBetween: 20 },
                            768: { slidesPerView: 3, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                            bulletClass: "swiper-bullet",
                            bulletActiveClass: "swiper-bullet-active",
                        }}
                        navigation={{
                            nextEl: ".swiper-button-next-custom",
                            prevEl: ".swiper-button-prev-custom",
                        }}
                        modules={[Pagination, Autoplay, Navigation]}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={true}
                        speed={600}
                        className="!pb-6 !px-1"
                    >
                        {displayProducts.map((product) => (
                            <SwiperSlide key={product.id || product._id} className="!h-auto">
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </section>
    );
}