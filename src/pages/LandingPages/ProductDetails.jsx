

import { useState, useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Star,
} from "lucide-react";
import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import DeliveryIconSVG from "@/components/SVG/DeliveryIconSVG";
import FreeDeliveryIconSVG from "@/components/SVG/FreeDeliveryIconSVG";
import AuthenticIconSVG from "@/components/SVG/AuthenticIconSVG";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync } from "@/Redux/cartSlice";
import { addToWishlistAsync, removeFromWishlistAsync } from "@/Redux/wishlistSlice";

import { productAPI } from "@/lib/apiClient";

// Fallback sizes if not defined in database
const DEFAULT_STANDARD_SIZES = [
  { size: "XS", enabled: true, stock: 10, sequence: 0 },
  { size: "S", enabled: true, stock: 10, sequence: 1 },
  { size: "M", enabled: true, stock: 10, sequence: 2 },
  { size: "L", enabled: true, stock: 10, sequence: 3 },
  { size: "XL", enabled: true, stock: 10, sequence: 4 },
  { size: "XXL", enabled: true, stock: 10, sequence: 5 },
];

const DEFAULT_ML_SIZES = [
  { size: "100ml", enabled: true, stock: 10, sequence: 0 },
  { size: "125ml", enabled: true, stock: 10, sequence: 1 },
  { size: "150ml", enabled: true, stock: 10, sequence: 2 },
  { size: "200ml", enabled: true, stock: 10, sequence: 3 },
];

// "You May Also Like" products
const MAY_LIKE_DATA = [];

// Accordion content
const ACCORDION_SECTIONS = [
  {
    id: "description",
    label: "DESCRIPTION",
    content:
      "AEVUM Signature is a timeless Eau de Parfum crafted for those who appreciate understated luxury. A refined blend of natural florals, warm woods, and subtle spice creates an effortlessly elegant fragrance that lingers beautifully throughout the day.",
  },
  {
    id: "composition",
    label: "COMPOSITION",
    content:
      "Top notes: Bergamot, Pink Pepper. Heart notes: Rose, Jasmine, Iris. Base notes: Sandalwood, Musk, Amber, Vetiver. 100ml Eau de Parfum. Alcohol Denat., Aqua, Parfum.",
  },
];

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || []);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { slug } = useParams();
  const [prevSlug, setPrevSlug] = useState(slug);
  const [product, setProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isPerfume = product?.productType === "Perfumes" || 
                    product?.category?.toLowerCase() === "fragrance" || 
                    product?.category?.toLowerCase() === "perfumes";

  const productSizes = product?.sizes && product.sizes.length > 0
    ? [...product.sizes].sort((a, b) => a.sequence - b.sequence)
    : (isPerfume ? DEFAULT_ML_SIZES : DEFAULT_STANDARD_SIZES);

  const hasSizes = productSizes.length > 0;
  const activeSizes = productSizes.filter((s) => s.enabled);
  const isOutOfStock = hasSizes && (activeSizes.length === 0 || activeSizes.every((s) => s.stock <= 0));

  const [reviewsData, setReviewsData] = useState({ reviews: [], avgRating: 0, count: 0 });
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const user = JSON.parse(localStorage.getItem("aevum_user") || "null");
  const isLoggedIn = !!localStorage.getItem("aevum_token");
  
  const alreadyReviewed = user && reviewsData.reviews.some(
    (r) => r.user === user._id || r.user?._id === user._id
  );

  const fetchReviews = useCallback(async (productId) => {
    try {
      const data = await productAPI.getReviews(productId);
      setReviewsData({
        reviews: data.reviews || [],
        avgRating: data.avgRating || 0,
        count: data.count || 0,
      });
    } catch (e) {
      console.error("Error fetching reviews:", e);
    }
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const productId = product._id || product.id;
      const res = await productAPI.createReview(productId, {
        rating: ratingInput,
        comment: commentInput,
      });

      toast.success(res.message || "Review submitted successfully!");
      setCommentInput("");
      setRatingInput(5);
      fetchReviews(productId);
    } catch (err) {
      console.error("Submit review failed:", err);
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first", {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        },
      });
      return;
    }

    navigate("/checkout", {
      state: {
        fromCart: false,
        items: [
          {
            productId: product._id || product.id,
            _id: product._id,
            id: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            quantity: quantity,
            image: product.image,
            size: selectedSize || "Default",
          },
        ],
      },
    });
  };

  const handleAddToBag = () => {
    if (!product) return;

    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first", {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        },
      });
      return;
    }

    dispatch(
      addToCartAsync({
        id: product.id,
        _id: product._id,
        title: product.title,
        category: product.category,
        price: product.price,
        quantity: quantity,
        image: product.image,
        size: selectedSize || "Default",
      }),
    );

    toast.success(`Added ${product.title} to bag!`, {
      position: "bottom-center",
      style: {
        background: "#1A1A1A",
        color: "#FFF",
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        borderRadius: "4px",
      },
    });

    // Show interactive secondary option to proceed to bag
    setTimeout(() => {
      toast(
        (t) => (
          <div className="flex items-center justify-between gap-3">
            <span className="font-inter text-xs">Added to bag</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/cart");
              }}
              className="px-2.5 py-1 bg-white text-[#1A1A1A] font-semibold text-[10px] uppercase tracking-wider rounded-sm shadow-sm"
            >
              View Bag
            </button>
          </div>
        ),
        {
          position: "bottom-center",
          duration: 5000,
          style: {
            background: "#1A1A1A",
            color: "#FFF",
            fontFamily: "Inter, sans-serif",
          },
        },
      );
    }, 800);
  };




  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setProduct(null);
    setIsLoading(true);
  }

  useEffect(() => {
    // Reset local product states on slug change
    setSelectedSize("");
    setShowSizeChart(false);
    setQuantity(1);
    setOpenSection(null);

    const fetchProductAndRelated = async () => {
      setIsLoading(true);
      try {
        const data = await productAPI.getById(slug);
        const currentProd = data.product || data;
        setProduct(currentProd);
        fetchReviews(currentProd._id || currentProd.id);
        
        try {
          const relatedData = await productAPI.getRelated(slug);
          setRelatedProducts(relatedData.products || []);
        } catch (relErr) {
          console.error("Failed to fetch related products:", relErr);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [slug]);

  const handleQtyDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleQtyIncrease = () => {
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size first to adjust quantity", {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        },
      });
      return;
    }

    const selectedSizeObj = productSizes.find((s) => s.size === selectedSize);
    const maxStock = selectedSizeObj ? selectedSizeObj.stock : 10;

    if (quantity >= maxStock) {
      toast.error(`Only ${maxStock} units available for size ${selectedSize}`, {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        },
      });
      return;
    }

    setQuantity((q) => q + 1);
  };

  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));

  const isWishlisted = wishlistItems.some(
    (item) => item.id === (product?.id || product?._id) || item._id === (product?.id || product?._id)
  );

  const toggleWishlist = () => {
    if (!product) return;
    const productId = product._id || product.id;
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(productId));
      toast.success(`${product.title} removed from wishlist`, {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        }
      });
    } else {
      dispatch(addToWishlistAsync(product));
      toast.success(`${product.title} added to wishlist`, {
        position: "bottom-center",
        style: {
          background: "#1A1A1A",
          color: "#FFF",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          borderRadius: "4px",
        }
      });
    }
  };

  // Fallback if no product data
  if (!product && !isLoading) {
    return (
      <section className="py-20">
        <Container>
          <div className="text-center text-[#72706F]">
            <p className="text-lg mb-4">Product not found</p>
            <Link
              to="/store"
              className="inline-block px-6 py-3 border border-[#2C2A29] text-[#2C2A29] hover:bg-[#2C2A29] hover:text-white transition-colors text-sm tracking-[0.2em] uppercase"
            >
              Back to Store
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-3/4 bg-[#F2EFE8] rounded-sm" />
            <div className="space-y-6">
              <div className="h-4 bg-[#E5E2DA] rounded w-1/4" />
              <div className="h-8 bg-[#E5E2DA] rounded w-3/4" />
              <div className="h-6 bg-[#E5E2DA] rounded w-1/3" />
              <div className="h-px bg-[#E5E2DA]" />
              <div className="space-y-3">
                <div className="h-4 bg-[#E5E2DA] rounded w-1/5" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-16 bg-[#E5E2DA] rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      {/* ── Main Product Section (WITH Container) ── */}
      <section className="py-8 sm:py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ── Left: Product Image ── */}
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F2EFE8] border border-[#E5E2DA]">
              <img
                src={product.image}
                alt={product.title}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-4">
              {/* Category Label */}
              <p className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#72706F] uppercase mb-3">
                {product.category}
              </p>

              {/* Product Name */}
              <h1 className="font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] mb-3 sm:mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <p className="font-inter text-lg sm:text-xl text-[#1A1A1A] font-light mb-6 sm:mb-8">
                {product.price}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-[#E5E2DA] mb-6 sm:mb-8" />

              {/* Size Selector */}
              {hasSizes && (
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#72706F] uppercase">
                      SIZE {selectedSize && <span className="text-[#1A1A1A] font-bold ml-1">({selectedSize})</span>}
                    </p>
                    {product.sizeChartImage && (
                      <button 
                        onClick={() => setShowSizeChart(true)}
                        className="text-[#72706F] text-[10px] sm:text-xs tracking-[0.2em] uppercase underline hover:text-[#1A1A1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 rounded-sm"
                      >
                        Size Guide
                      </button>
                    )}
                  </div>
                  
                  {/* Sizing grid: Desktop flex wrap, Tablet grid, Mobile Touch touch-friendly grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                    {activeSizes.map((s) => {
                      const hasStock = s.stock > 0;
                      const isSelectable = hasStock;
                      
                      return (
                        <button
                          key={s.size}
                          type="button"
                          disabled={!isSelectable}
                          onClick={() => {
                            setSelectedSize(s.size);
                            if (quantity > s.stock) {
                              setQuantity(s.stock);
                              toast.error(`Quantity adjusted to ${s.stock} (maximum stock for size ${s.size})`, {
                                position: "bottom-center",
                                style: {
                                  background: "#1A1A1A",
                                  color: "#FFF",
                                  fontFamily: "Inter, sans-serif",
                                  fontSize: "12px",
                                  borderRadius: "4px",
                                },
                              });
                            }
                          }}
                          className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold tracking-wider border transition-all duration-200 min-h-[48px] min-w-[64px] sm:min-w-[60px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 relative rounded-sm ${
                            !isSelectable
                              ? "opacity-30 border-[#E5E2DA] text-[#72706F] cursor-not-allowed"
                              : selectedSize === s.size
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]"
                                : "bg-white text-[#2C2A29] border-[#D9D5D2] hover:border-[#1A1A1A]"
                          }`}
                          aria-pressed={selectedSize === s.size}
                        >
                          <span>{s.size}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#72706F] uppercase mb-3">
                  QUANTITY
                </p>
                <div className="flex items-center border border-[#D9D5D2] w-fit">
                  <button
                    onClick={handleQtyDecrease}
                    className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-[#2C2A29] hover:bg-[#F8F2EB] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 min-w-[44px]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-[#1A1A1A] text-sm border-l border-r border-[#D9D5D2] font-inter">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQtyIncrease}
                    className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center text-[#2C2A29] hover:bg-[#F8F2EB] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 min-w-[44px]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToBag}
                  className="w-full py-3.5 sm:py-4 bg-[#1A1A1A] text-white text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#2C2A29] transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? "Currently Out of Stock" : "ADD TO BAG"}
                </button>
                {!isOutOfStock && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 sm:py-4 bg-white text-[#1A1A1A] text-[11px] sm:text-xs tracking-[0.25em] uppercase border border-[#D9D5D2] hover:bg-[#F8F2EB] transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                  >
                    BUY NOW
                  </button>
                )}
              </div>

              {/* Add to Wishlist */}
              <button
                onClick={toggleWishlist}
                className={`flex items-center justify-center gap-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-colors duration-150 mb-8 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 rounded-sm px-4 ${
                  isWishlisted
                    ? "text-[#D32F2F]"
                    : "text-[#72706F] hover:text-[#1A1A1A]"
                }`}
                aria-pressed={isWishlisted}
              >
                <Heart
                  size={16}
                  className={`transition-colors ${isWishlisted ? "fill-current" : ""}`}
                />
                {isWishlisted ? "IN WISHLIST" : "ADD TO WISHLIST"}
              </button>

              {/* Divider */}
              <div className="w-full h-px bg-[#E5E2DA] mb-6 sm:mb-8" />

              {/* Shipping Info */}
              <div className="flex flex-col gap-4 mb-8">
                {[
                  {
                    icon: <DeliveryIconSVG />,
                    text: "Complimentary delivery in 2-4 days.",
                  },
                  {
                    icon: <FreeDeliveryIconSVG />,
                    text: "Free returns within 30 days",
                  },
                  {
                    icon: <AuthenticIconSVG />,
                    text: "Authenticity guaranteed by the Maison",
                  },
                ].map(({ icon, text }, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[#72706F] mt-0.5 shrink-0">
                      {icon}
                    </span>
                    <p className="font-inter text-[11px] sm:text-xs text-[#72706F] leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#E5E2DA] mb-4 sm:mb-6" />

              {/* Accordion Sections */}
              {[
                {
                  id: "description",
                  label: "DESCRIPTION",
                  content: product?.description || "AEVUM Signature is a timeless Eau de Parfum crafted for those who appreciate understated luxury. A refined blend of natural florals, warm woods, and subtle spice creates an effortlessly elegant fragrance that lingers beautifully throughout the day.",
                },
                {
                  id: "composition",
                  label: "COMPOSITION",
                  content: product?.composition || "Top notes: Bergamot, Pink Pepper. Heart notes: Rose, Jasmine, Iris. Base notes: Sandalwood, Musk, Amber, Vetiver. 100ml Eau de Parfum. Alcohol Denat., Aqua, Parfum.",
                },
              ].map((section) => (
                <div
                  key={section.id}
                  className="border-b border-[#E5E2DA] last:border-0"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-4 sm:py-5 text-left focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 rounded-sm"
                    aria-expanded={openSection === section.id}
                    aria-controls={`${section.id}-content`}
                  >
                    <span className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#1A1A1A] uppercase">
                      {section.label}
                    </span>
                    <span className="text-[#72706F] transition-transform duration-200">
                      {openSection === section.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </button>

                  {/* Accordion Content */}
                  <div
                    id={`${section.id}-content`}
                    className={`overflow-hidden transition-all duration-300 ${
                      openSection === section.id
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="font-inter text-[11px] sm:text-xs text-[#72706F] leading-relaxed pb-4 sm:pb-5">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Customer Reviews Section ── */}
      <section className="py-12 sm:py-16 md:py-20 border-t border-[#E5E2DA] bg-[#FDFAF4]">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cormorant text-2xl sm:text-3xl md:text-4xl font-light text-[#1A1A1A] tracking-wide mb-8 text-center sm:text-left">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {/* Summary Stats */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left bg-white border border-[#E5E2DA] p-6 rounded-lg shadow-sm h-fit">
                <span className="font-inter text-5xl font-light text-[#1A1A1A]">
                  {reviewsData.avgRating.toFixed(1)}
                </span>
                {/* Stars container */}
                <div className="flex items-center gap-1 my-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.round(reviewsData.avgRating)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-[#E5E2DA]"
                      }
                    />
                  ))}
                </div>
                <span className="font-inter text-xs text-[#72706F] uppercase tracking-wider">
                  Based on {reviewsData.count} {reviewsData.count === 1 ? "review" : "reviews"}
                </span>
              </div>

              {/* Review list & Write form */}
              <div className="md:col-span-2 flex flex-col gap-8">
                {/* Write a Review Section */}
                <div className="bg-white border border-[#E5E2DA] p-6 rounded-lg shadow-sm">
                  <h3 className="font-inter text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
                    Write a review
                  </h3>
                  {!isLoggedIn ? (
                    <p className="font-inter text-xs text-[#72706F]">
                      Please{" "}
                      <Link to="/auth/login" className="text-[#1A1A1A] font-bold underline">
                        Log In
                      </Link>{" "}
                      to write a review for this product.
                    </p>
                  ) : alreadyReviewed ? (
                    <p className="font-inter text-xs text-[#72706F]">
                      You have already reviewed this product.
                    </p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Rating selection */}
                      <div className="flex items-center gap-2">
                        <span className="font-inter text-xs text-[#72706F] uppercase tracking-wider">
                          Rating:
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const starValue = i + 1;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setRatingInput(starValue)}
                                className="focus:outline-none transition-transform active:scale-95"
                              >
                                <Star
                                  size={20}
                                  className={
                                    starValue <= ratingInput
                                      ? "fill-[#D4AF37] text-[#D4AF37]"
                                      : "text-[#E5E2DA] hover:text-[#D4AF37]/50"
                                  }
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Comment textarea */}
                      <div>
                        <textarea
                          rows={3}
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          placeholder="Share your thoughts about the size, material, or fit..."
                          className="w-full border border-[#E5E2DA] focus:border-[#1A1A1A] p-3 text-xs sm:text-sm font-inter text-[#1A1A1A] placeholder-[#72706F]/50 rounded-sm shadow-sm outline-none transition-all duration-200 focus:ring-1 focus:ring-[#1A1A1A]"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="w-full sm:w-auto px-6 py-3 bg-[#1A1A1A] hover:bg-[#2C2A29] text-white text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 disabled:opacity-50"
                      >
                        {isSubmittingReview ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Review Items */}
                <div className="space-y-4">
                  {reviewsData.reviews.length > 0 ? (
                    reviewsData.reviews.map((rev) => (
                      <div
                        key={rev._id}
                        className="bg-white border border-[#E5E2DA] p-5 rounded-lg shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div>
                            <span className="font-inter text-sm font-semibold text-[#1A1A1A]">
                              {rev.name}
                            </span>
                            <div className="flex items-center gap-0.5 mt-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < rev.rating
                                      ? "fill-[#D4AF37] text-[#D4AF37]"
                                      : "text-[#E5E2DA]"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <span className="font-inter text-[10px] text-[#72706F]">
                            {new Date(rev.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="font-inter text-xs text-[#72706F] leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white/40 border border-dashed border-[#E5E2DA] rounded-sm">
                      <p className="font-inter text-xs text-[#72706F] italic">
                        No reviews yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── "You May Also Like" Section (FULL-WIDTH, NO Container) ── */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F8F2EB] w-full">
        {/* Header - Centered with max-width for readability */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-10 sm:mb-12">
          <h3 className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#72706F] uppercase">
            Complete the Look
          </h3>
          <h2 className="mt-3 sm:mt-4 font-cormorant text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#13110F] tracking-[0.02em] leading-tight">
            You May Also Like
          </h2>
        </div>

        {/* Full-width Product Grid - NO Container wrapper */}
        <div className="w-full overflow-x-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-0 px-4 sm:px-6 lg:px-0">
            {(relatedProducts.length > 0 ? relatedProducts : MAY_LIKE_DATA.slice(0, 5)).map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Size Chart Modal */}
      {showSizeChart && product.sizeChartImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div 
            className="relative bg-white max-w-2xl w-full rounded-lg shadow-2xl overflow-hidden p-6 sm:p-8 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowSizeChart(false)} 
              className="absolute top-4 right-4 p-2 text-[#72706F] hover:text-[#1A1A1A] hover:bg-black/5 rounded-full transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h3 className="font-cormorant text-2xl font-light text-[#1A1A1A] tracking-wide mb-6 text-center">
              Size Guide
            </h3>

            <div className="w-full max-h-[70vh] overflow-y-auto flex items-center justify-center bg-[#FAF9F6] rounded-sm p-4 border border-[#E5E2DA]">
              <img 
                src={product.sizeChartImage} 
                alt="Size Chart" 
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
