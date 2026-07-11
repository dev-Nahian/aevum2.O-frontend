

import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import DeliveryIconSVG from "@/components/SVG/DeliveryIconSVG";
import FreeDeliveryIconSVG from "@/components/SVG/FreeDeliveryIconSVG";
import AuthenticIconSVG from "@/components/SVG/AuthenticIconSVG";
import { useDispatch } from "react-redux";
import { addToCartAsync } from "@/Redux/cartSlice";

import { productAPI } from "@/lib/apiClient";

// Perfume sizes (sorted logically)
const PERFUME_SIZES = ["100ml", "125ml", "150ml", "200ml"];

// "You May Also Like" products
const MAY_LIKE_DATA = [
  {
    id: 1,
    category: "EAU DE TOILETTE",
    title: "Ocean Breeze Mist",
    price: "$98",
    image: `https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
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
    category: "OUTERWEAR",
    title: "Camel Cashmere Overcoat",
    price: "$2,890",
    image: `https://mcprod.aarong.com/media/catalog/product/1/2/1200000038146.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=&width=`,
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
    category: "PREMIUM SCENT",
    title: "Golden Sandalwood",
    price: "$160",
    image: `https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=687&auto=format&fit=crop`,
  },
];

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
  const [selectedSize, setSelectedSize] = useState("100ml");
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBuyNow = () => {
    if (!product) return;
    navigate("/checkout", {
      state: {
        fromCart: false,
        items: [
          {
            productId: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            quantity: quantity,
            image: product.image,
            size: selectedSize,
          },
        ],
      },
    });
  };

  const handleAddToBag = () => {
    if (!product) return;

    dispatch(
      addToCartAsync({
        id: product.id,
        _id: product._id,
        title: product.title,
        category: product.category,
        price: product.price,
        quantity: quantity,
        image: product.image,
        size: selectedSize,
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


  const { slug } = useParams();
  const [product, setProduct] = useState(location.state?.data || null);

  useEffect(() => {
    if (!product && slug) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const data = await productAPI.getById(slug);
          setProduct(data.product || data);
        } catch (error) {
          console.error("Failed to fetch product:", error);
          toast.error("Failed to load product details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else if (product) {
      setIsLoading(false);
    }
  }, [slug, product]);

  const handleQtyDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleQtyIncrease = () => setQuantity((q) => q + 1);
  const toggleSection = (section) =>
    setOpenSection((prev) => (prev === section ? null : section));
  const toggleWishlist = () => setIsWishlisted((prev) => !prev);

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
              <div className="mb-6 sm:mb-8">
                <p className="font-inter text-[10px] sm:text-xs tracking-[0.2em] text-[#72706F] uppercase mb-3">
                  SIZE
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {PERFUME_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs tracking-wider border transition-all duration-200 min-h-[44px] min-w-[60px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 ${
                        selectedSize === size
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#2C2A29] border-[#D9D5D2] hover:border-[#1A1A1A]"
                      }`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="mt-3 text-[#72706F] text-[10px] sm:text-xs tracking-[0.2em] uppercase underline hover:text-[#1A1A1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30 rounded-sm">
                  Size Guide
                </button>
              </div>

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
                  onClick={handleAddToBag}
                  className="w-full py-3.5 sm:py-4 bg-[#1A1A1A] text-white text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#2C2A29] transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 sm:py-4 bg-white text-[#1A1A1A] text-[11px] sm:text-xs tracking-[0.25em] uppercase border border-[#D9D5D2] hover:bg-[#F8F2EB] transition-colors duration-200 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#2C2A29]/30"
                >
                  BUY NOW
                </button>
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
              {ACCORDION_SECTIONS.map((section) => (
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
            {MAY_LIKE_DATA.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
