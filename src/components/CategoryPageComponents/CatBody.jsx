import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import Pagination01 from "@/components/common/pagination-01";
import { useEffect, useState, useMemo } from "react";
import { productAPI } from "@/lib/apiClient";

// ✅ Product data maps for cleaner logic
const PRODUCT_MAP = {
    men: [],
    women: [],
    perfumes: [],
};

// Category display names
const CATEGORY_NAMES = {
    men: "Mens Wear",
    women: "Womens Wear",
    perfumes: "Fragrance",
};

export default function CatBody({ slug }) {
    const [dbProducts, setDbProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchCategoryProducts = async (showSkeleton = true) => {
            if (showSkeleton) setIsLoading(true);
            try {
                const params = {};
                if (slug === "men") {
                    params.productType = "Men";
                } else if (slug === "women") {
                    params.productType = "Women";
                } else if (slug === "perfumes") {
                    params.productType = "Perfumes";
                }

                const data = await productAPI.getAll(params);
                setDbProducts(data.products || data);
            } catch (error) {
                console.error("Error fetching category products:", error);
                // Fallback to static mapping if API fails
                setDbProducts(PRODUCT_MAP[slug] || PRODUCT_MAP.men);
            } finally {
                if (showSkeleton) setIsLoading(false);
            }
        };

        fetchCategoryProducts(true);

        const handleFocus = () => {
            fetchCategoryProducts(false);
        };
        window.addEventListener("focus", handleFocus);

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchCategoryProducts(false);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [slug]);

    const currentProducts = dbProducts;

    const categoryLabel = CATEGORY_NAMES[slug] || "Collection";

    const handleFilterClick = () => {
        // TODO: Open filter modal/sheet
        console.log("Filter clicked for", categoryLabel);
    };

    return (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
            <Container>
                {/* Header: Category Label */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 sm:pb-6 border-b border-[#D9D5D2]">
                    <h4 className="font-inter text-sm sm:text-base font-normal text-[#9B9694] leading-tight uppercase tracking-[1.6px]">
                        {categoryLabel}
                    </h4>
                </div>

                {/* Product Grid - Responsive Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10">
                    {isLoading ? (
                        // Skeleton loaders
                        Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse">
                                <div className="aspect-[3/4] bg-[#F2EFE8] border border-[#E5E2DA] rounded-sm mb-3" />
                                <div className="h-4 bg-[#E5E2DA] rounded w-3/4 mx-auto mb-2" />
                                <div className="h-3 bg-[#E5E2DA] rounded w-1/2 mx-auto" />
                            </div>
                        ))
                    ) : currentProducts?.length > 0 ? (
                        currentProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={{
                                    ...product,
                                    // Ensure images load lazily for performance
                                    imageProps: { loading: "lazy", decoding: "async" }
                                }} 
                            />
                        ))
                    ) : (
                        // Empty state
                        <div className="col-span-full text-center py-16">
                            <p className="font-inter text-[#9B9694] text-sm sm:text-base">
                                No products found in this collection.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination - Responsive Alignment */}
                {currentProducts?.length > 0 && !isLoading && (
                    <div className="mt-12 sm:mt-16 md:mt-20 w-full flex justify-center sm:justify-end">
                        <Pagination01 />
                    </div>
                )}
            </Container>
        </section>
    );
}