import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Share, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";

// Import local premium images
import perfumeImage from "@/assets/Images/perfume.png";
import perfume1 from "@/assets/Images/Perfume1.avif";
import perfume2 from "@/assets/Images/Perfume2.avif";
import mens1 from "@/assets/Images/Mens1.avif";

// Sample wishlist data
const INITIAL_WISHLIST = [
    {
        id: 1,
        category: "Fragrance",
        title: "Imagination",
        price: "$320",
        image: perfumeImage,
    },
    {
        id: 2,
        category: "Fragrance",
        title: "Midnight Oud Essence",
        price: "$120",
        image: perfume1,
    },
    {
        id: 3,
        category: "Fragrance",
        title: "Velvet Rose Elixir",
        price: "$145",
        image: perfume2,
    },
    {
        id: 4,
        category: "Outerwear",
        title: "Camel Cashmere Overcoat",
        price: "$2,890",
        image: mens1,
    },
];

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState(INITIAL_WISHLIST);
    const [isRemoving, setIsRemoving] = useState(null);
    const dispatch = useDispatch();

    const handleRemove = (id) => {
        setIsRemoving(id);
        const itemToRemove = wishlistItems.find(item => item.id === id);
        // Simulate API call delay
        setTimeout(() => {
            setWishlistItems((prev) => prev.filter((item) => item.id !== id));
            setIsRemoving(null);
            toast.success(`${itemToRemove?.title || "Item"} removed from wishlist`, {
                position: "bottom-center",
                style: {
                    background: "#1A1A1A",
                    color: "#FFF",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    borderRadius: "4px",
                }
            });
        }, 300);
    };

    const handleMoveToBag = (id) => {
        const item = wishlistItems.find(i => i.id === id);
        if (!item) return;

        dispatch(addToCart({
            id: item.id,
            title: item.title,
            category: item.category,
            price: item.price,
            quantity: 1,
            image: item.image,
            size: "100ml"
        }));

        toast.success(`Added ${item.title} to your bag`, {
            position: "bottom-center",
            style: {
                background: "#1A1A1A",
                color: "#FFF",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                borderRadius: "4px",
            }
        });
    };

    const handlePersonalize = (id) => {
        const item = wishlistItems.find(i => i.id === id);
        toast.success(`Opening engraving options for ${item?.title || "item"}`, {
            icon: "✨",
            position: "bottom-center",
            style: {
                background: "#1A1A1A",
                color: "#FFF",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                borderRadius: "4px",
            }
        });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Wishlist link copied to clipboard!", {
            position: "bottom-center",
            style: {
                background: "#1A1A1A",
                color: "#FFF",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                borderRadius: "4px",
            }
        });
    };

    const isEmpty = wishlistItems.length === 0;

    return (
        <section className="py-12 sm:py-16 md:py-20 min-h-[80vh]">
            {/* Header / Call to Action */}
            <div className="w-full py-12 md:py-16 text-center px-4 mb-10 sm:mb-12">
                <h1 className="font-cormorant text-2xl sm:text-[32px] md:text-[38px] lg:text-[44px] font-medium text-[#1A1A1A] tracking-[0.02em] leading-tight mb-3">
                    Don't lose your favorites anymore
                </h1>
                <p className="font-inter text-xs sm:text-sm text-[#72706F] tracking-wide mb-8">
                    Sign In or Create an account to save your selection
                </p>
                <div className="flex flex-row items-center justify-center gap-3">
                    <Link
                        to="/auth/login"
                        className="px-8 py-3 bg-[#1A1A1A] text-white text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-[#2C2A29] transition-all min-h-[44px] flex items-center justify-center"
                    >
                        Sign In
                    </Link>
                    <button
                        onClick={handleShare}
                        className="px-8 py-3 text-[#1A1A1A] border border-[#1A1A1A] text-[11px] font-semibold tracking-[0.2em] uppercase rounded-full hover:bg-gray-50 transition-all min-h-[44px] flex items-center justify-center gap-2"
                    >
                        <Share size={13} />
                        Share
                    </button>
                </div>
            </div>

                
                    {/* Wishlist Title Bar */}
                    {!isEmpty && (
                        <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-4 mb-8 px-20">
                            <h2 className="font-cormorant text-xl sm:text-2xl font-light text-[#1A1A1A] tracking-wider uppercase">
                                My Selection ({wishlistItems.length})
                            </h2>
                            <button
                                onClick={() => {
                                    setWishlistItems([]);
                                    toast.success("Wishlist cleared");
                                }}
                                className="font-inter text-[10px] tracking-[0.2em] text-[#72706F] uppercase hover:text-red-600 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                

                {/* Empty State */}
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-6 border border-[#E5E2DA]">
                            <Heart size={24} className="text-[#72706F]" />
                        </div>
                        
                        <h2 className="font-cormorant text-xl sm:text-2xl md:text-3xl font-medium text-[#1A1A1A] mb-3">
                            Your wishlist is empty
                        </h2>
                        
                        <p className="font-inter text-sm text-[#72706F] max-w-[400px] mb-8">
                            Discover pieces you love and save them here for later.
                        </p>
                        
                        <Link
                            to="/category/perfumes"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#2C2A29] transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30"
                        >
                            <ShoppingBag size={14} />
                            Explore Fragrances
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Items Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-0">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className={`transition-all duration-300 ${
                                    isRemoving === item.id ? "opacity-50 scale-[0.98]" : ""
                                }`}
                            >
                                <ProductCard
                                    product={item}
                                    variant="wishlist"
                                    onRemove={handleRemove}
                                    onAddToBag={handleMoveToBag}
                                    onPersonalize={handlePersonalize}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Return to shop */}
                {!isEmpty && (
                    <div className="mt-16 text-center">
                        <Link
                            to="/category/perfumes"
                            className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-inter tracking-[0.2em] text-[#72706F] uppercase hover:text-[#1A1A1A] transition-colors"
                        >
                            ← Return to collection
                        </Link>
                    </div>
                )}
            
        </section>
    );
}