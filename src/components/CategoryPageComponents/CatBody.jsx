import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import Pagination01 from "@/components/common/pagination-01";
import { useEffect, useState, useMemo } from "react";
import { productAPI } from "@/lib/apiClient";

// ✅ Product data maps for cleaner logic
const PRODUCT_MAP = {
    men: [
        {
            id: 1,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://plus.unsplash.com/premium_photo-1669688174622-0393f5c6baa2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        },
        {
            id: 2,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://images.unsplash.com/photo-1552168212-9ceb61083ba0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        },
        {
            id: 3,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000038146.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 4,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000038565.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 5,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000035528.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 6,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000035577.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 7,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com//media/catalog/product/1/2/1200000036111.jpg`,
        },
        {
            id: 8,
            category: "OUTERWEAR",
            title: "Camel Cashmere Overcoat",
            price: "$2,890",
            image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000038376.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
    ],
    women: [
        {
            id: 1,
            category: "KURTA",
            title: "Printed Cotton Kurta",
            price: "$89",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000118265.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 2,
            category: "SAREE",
            title: "Jamdani Cotton Saree",
            price: "$145",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000116404.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 3,
            category: "SALWAR KAMEEZ",
            title: "Embroidered Lawn Set",
            price: "$110",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000117011.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 4,
            category: "OUTERWEAR",
            title: "Handcrafted Long Shrug",
            price: "$95",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000116422.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 5,
            category: "SAREE",
            title: "Silk Blend Saree",
            price: "$180",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000116153.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 6,
            category: "KURTI",
            title: "Minimal Embroidered Kurti",
            price: "$75",
            image: `https://www.aarong.com/_next/image?url=https%3A%2F%2Fmcprod.aarong.com%2Fmedia%2Fshopthelook_shoplook%2F1%2F1%2F11_1.jpg&w=640&q=75`,
        },
        {
            id: 7,
            category: "TOPS",
            title: "Relaxed Fit Cotton Top",
            price: "$68",
            image: `https://mcprod.aarong.com/media/catalog/product/0/4/0410000116796.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
        },
        {
            id: 8,
            category: "ETHNIC WEAR",
            title: "Traditional Festive Outfit",
            price: "$210",
            image: `https://www.aarong.com/_next/image?url=https%3A%2F%2Fmcprod.aarong.com%2Fmedia%2Fshopthelook_shoplook%2F7%2F_%2F7_26.jpg&w=640&q=75`,
        },
    ],
    perfumes: [
        {
            id: 1,
            category: "EAU DE PARFUM",
            title: "Midnight Oud Essence",
            price: "$120",
            image: `https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 2,
            category: "LUXURY FRAGRANCE",
            title: "Velvet Rose Elixir",
            price: "$145",
            image: `https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 3,
            category: "UNISEX PERFUME",
            title: "Amber Noir Signature",
            price: "$135",
            image: `https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 4,
            category: "EAU DE TOILETTE",
            title: "Ocean Breeze Mist",
            price: "$98",
            image: `https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        },
        {
            id: 5,
            category: "PREMIUM SCENT",
            title: "Golden Sandalwood",
            price: "$160",
            image: `https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 6,
            category: "ARABIAN PERFUME",
            title: "Royal Oud Intense",
            price: "$175",
            image: `https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 7,
            category: "FLORAL COLLECTION",
            title: "Blooming Jasmine Aura",
            price: "$115",
            image: `https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=687&auto=format&fit=crop`,
        },
        {
            id: 8,
            category: "NICHE FRAGRANCE",
            title: "Obsidian Musk Reserve",
            price: "$190",
            image: `https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=687&auto=format&fit=crop`,
        },
    ],
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
        const fetchCategoryProducts = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchCategoryProducts();
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
                {/* Header: Category Label + Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 sm:pb-6 border-b border-[#D9D5D2]">
                    <h4 className="font-inter text-sm sm:text-base font-normal text-[#9B9694] leading-tight uppercase tracking-[1.6px]">
                        {categoryLabel}
                    </h4>
                    
                    {/* Filter Button */}
                    <button 
                        onClick={handleFilterClick}
                        className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-sm hover:bg-[#F8F2EB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B9694]/30 min-h-[44px]"
                        aria-label="Open product filters"
                    >
                        <span className="font-inter text-sm font-normal text-[#9B9694] uppercase tracking-[1.6px]">
                            FILTER
                        </span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9B9694]">
                            <path d="M5 12L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 19L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
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