import { useState, useEffect } from "react";
import Container from "../../components/common/Container";
import ProductCard from "../../components/common/ProductCard";
import { Link } from "react-router-dom";
import { productAPI } from "@/lib/apiClient";

// Sample new arrivals data (replace with API fetch in production)
const NEW_ARRIVALS_DATA = [];

export default function NewArrivals() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);

    // Fetch new arrivals from backend API
    useEffect(() => {
        const fetchProducts = async (showSkeleton = true) => {
            if (showSkeleton) setIsLoading(true);
            try {
                const data = await productAPI.getAll({ newest: "true" });
                setProducts(data.products || data);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
                setProducts(NEW_ARRIVALS_DATA);
            } finally {
                if (showSkeleton) setIsLoading(false);
            }
        };
        fetchProducts(true);

        const handleFocus = () => {
            fetchProducts(false);
        };
        window.addEventListener("focus", handleFocus);

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchProducts(false);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    // Placeholder handlers (connect to cart/wishlist context in production)
    const handleAddToCart = (product) => {
        console.log("Add to cart:", product.id);
        // dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const handleAddToWishlist = (product) => {
        console.log("Add to wishlist:", product.id);
        // dispatch({ type: 'TOGGLE_WISHLIST', payload: product.id });
    };

    const handleViewProduct = (productId) => {
        console.log("View product:", productId);
        // navigate(`/product/${productId}`);
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FDFAF4]">
            <Container>
                {/* Header Section */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2">
                    <h6 className="font-inter text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#72706F] uppercase font-medium mb-3 sm:mb-4">
                        Just In
                    </h6>
                    <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-medium text-[#13110F] leading-tight sm:leading-[1.15]">
                        New Arrivals
                    </h2>
                    <p className="font-inter text-sm sm:text-base text-[#72706F] font-light tracking-wide mt-3 sm:mt-4 max-w-[90%] sm:max-w-[640px] mx-auto leading-relaxed">
                        The newest expressions from the AEVUM atelier — composed for the season ahead.
                    </p>
                </div>
            </Container>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-0 lg:gap-y-15">
                {isLoading ? (
                    // Skeleton loaders
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="animate-pulse">
                            <div className="aspect-[3/4] bg-[#F2EFE8] border border-[#E5E2DA] rounded-sm mb-3" />
                            <div className="h-4 bg-[#E5E2DA] rounded w-3/4 mx-auto mb-2" />
                            <div className="h-3 bg-[#E5E2DA] rounded w-1/2 mx-auto" />
                        </div>
                    ))
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                ...product,
                                imageProps: { loading: "lazy", decoding: "async" }
                            }}
                            onAddToCart={() => handleAddToCart(product)}
                            onAddToWishlist={() => handleAddToWishlist(product)}
                            onViewProduct={() => handleViewProduct(product.id)}
                        />
                    ))
                ) : (
                    // Empty state
                    <div className="col-span-full text-center py-16">
                        <p className="font-inter text-[#72706F] text-sm sm:text-base">
                            No new arrivals at the moment. Check back soon!
                        </p>
                    </div>
                )}
            </div>

            {/* Load More / View All CTA */}
            {!isLoading && products.length > 0 && (
                <div className="text-center mt-10 sm:mt-12 md:mt-16">
                    <Link to="/store" className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#2C2A29] transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30">
                        View All
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            )}
        </section>
    );
}