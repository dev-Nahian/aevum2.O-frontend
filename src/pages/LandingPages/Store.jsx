

import React, { useState, useEffect, useMemo, useRef } from "react";
import CatHero from "@/components/CategoryPageComponents/CatHero";
import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import Pagination01 from "@/components/common/pagination-01";
import { products } from "@/data/products";
import { SlidersHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { productAPI } from "@/lib/apiClient";

// Default filter state values
const DEFAULT_FILTERS = {
  types: ["Men", "Women", "Perfumes"],
  selectedSubCats: [],
  minPrice: 0,
  maxPrice: 1000,
  availability: [],
};

export default function Store() {
  // --- UI STATES ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("FEATURED");
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productAPI.getAll({ limit: 1000 });
        setDbProducts(response.products || []);
        setProductsLoaded(true);
      } catch (error) {
        console.error("Failed to load products from API:", error);
        // Fallback to static products if API fails
        setDbProducts(products);
        setProductsLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from API on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to load categories in store:", error);
      }
    };
    fetchCategories();
  }, []);

  // Sync types with categories productTypes dynamically
  useEffect(() => {
    if (categories.length > 0) {
      const dbTypes = Array.from(new Set(categories.map(c => c.productType || c.name)));
      setAppliedFilters(prev => ({
        ...prev,
        types: dbTypes
      }));
      setTempFilters(prev => ({
        ...prev,
        types: dbTypes
      }));
    }
  }, [categories]);

  // --- COLLAPSE STATES FOR DRAWER ACCORDIONS ---
  const [openSections, setOpenSections] = useState({
    productType: true,
    price: true,
    availability: true,
  });

  // --- FILTER STATES ---
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [tempFilters, setTempFilters] = useState(DEFAULT_FILTERS);

  const sortRef = useRef(null);

  // Close sorting dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger brief loading skeleton animation when filters or sorting change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [appliedFilters, sortOption]);

  // Sync tempFilters with appliedFilters when opening the drawer
  const openDrawer = () => {
    setTempFilters(appliedFilters);
    setIsFilterOpen(true);
  };

  const closeDrawer = () => {
    setIsFilterOpen(false);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // --- TEMPORARY FILTER TOGGLERS (IN DRAWER) ---
  const toggleTempType = (type) => {
    setTempFilters((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  };

  const toggleTempSubCat = (cat) => {
    setTempFilters((prev) => {
      const selectedSubCats = prev.selectedSubCats.includes(cat)
        ? prev.selectedSubCats.filter((c) => c !== cat)
        : [...prev.selectedSubCats, cat];
      return { ...prev, selectedSubCats };
    });
  };

  const toggleTempAvailability = (avail) => {
    setTempFilters((prev) => {
      const availability = prev.availability.includes(avail)
        ? prev.availability.filter((a) => a !== avail)
        : [...prev.availability, avail];
      return { ...prev, availability };
    });
  };

  // --- DRAWER ACTIONS ---
  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setTempFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // --- DIRECT REMOVAL ACTIONS FOR APPLIED TAGS ---
  const removeTypeFilter = (type) => {
    setAppliedFilters((prev) => {
      const types = prev.types.filter((t) => t !== type);
      return { ...prev, types };
    });
    setCurrentPage(1);
  };

  const removeSubCatFilter = (cat) => {
    setAppliedFilters((prev) => {
      const selectedSubCats = prev.selectedSubCats.filter((c) => c !== cat);
      return { ...prev, selectedSubCats };
    });
    setCurrentPage(1);
  };

  const removeAvailabilityFilter = (avail) => {
    setAppliedFilters((prev) => {
      const availability = prev.availability.filter((a) => a !== avail);
      return { ...prev, availability };
    });
    setCurrentPage(1);
  };

  const resetPriceFilter = () => {
    setAppliedFilters((prev) => ({
      ...prev,
      minPrice: 0,
      maxPrice: 1000,
    }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setAppliedFilters(DEFAULT_FILTERS);
    setTempFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };



  // --- FILTER & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    return dbProducts.filter((product) => {
      // 1. Filter by Product Type
      if (
        appliedFilters.types.length > 0 &&
        !appliedFilters.types.includes(product.productType)
      ) {
        return false;
      }
      if (appliedFilters.types.length === 0) {
        // If nothing checked, display empty
        return false;
      }

      // 2. Filter by Subcategory
      if (appliedFilters.selectedSubCats.length > 0) {
        if (!appliedFilters.selectedSubCats.includes(product.subCategory)) {
          return false;
        }
      }

      // 4. Filter by Price Range
      if (
        product.priceVal < appliedFilters.minPrice ||
        product.priceVal > appliedFilters.maxPrice
      ) {
        return false;
      }

      // 5. Filter by Availability
      if (
        appliedFilters.availability.length > 0 &&
        !appliedFilters.availability.includes(product.availability)
      ) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, dbProducts]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "BEST SELLING":
        return list.sort(
          (a, b) => (b.bestSelling ? 1 : 0) - (a.bestSelling ? 1 : 0),
        );
      case "NEWEST":
        return list.sort((a, b) => (b.newest ? 1 : 0) - (a.newest ? 1 : 0));
      case "PRICE LOW TO HIGH":
        return list.sort((a, b) => a.priceVal - b.priceVal);
      case "PRICE HIGH TO LOW":
        return list.sort((a, b) => b.priceVal - a.priceVal);
      case "FEATURED":
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortOption]);

  // --- PAGINATION CALCULATIONS ---
  // Each page will contain 5 rows only. In a 4-column grid (xl:grid-cols-4), this is 20 items per page.
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.max(
    Math.ceil(sortedProducts.length / ITEMS_PER_PAGE),
    1,
  );

  // Keep currentPage in bounds if filter updates the lists
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // --- DETECT ACTIVE FILTER STATUS (FOR PILLS ROW) ---
  const hasActiveFilters = useMemo(() => {
    return (
      appliedFilters.types.length < (categories.length > 0 ? categories.length : 3) ||
      appliedFilters.selectedSubCats.length > 0 ||
      appliedFilters.minPrice > 0 ||
      appliedFilters.maxPrice < 1000 ||
      appliedFilters.availability.length > 0
    );
  }, [appliedFilters, categories]);

  // --- DUAL PRICE SLIDER HELPER VARIABLES ---
  const minPercent = (tempFilters.minPrice / 1000) * 100;
  const maxPercent = (tempFilters.maxPrice / 1000) * 100;

  return (
    <div className="bg-[#FDFAF4] min-h-screen">
      {/* 1. HERO HERO BANNER */}
      <CatHero slug="store" />

      {/* 2. STORE BODY SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <Container>
          {/* FILTER & SORT HEADLINE BAR */}
          <div className="flex items-center justify-between pb-5 border-b border-[#D9D5D2]">
            {/* Filter Toggle Button */}
            <button
              onClick={openDrawer}
              className="inline-flex items-center gap-2 px-4 py-2 hover:bg-[#F8F2EB] rounded-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#9B9694]/40 min-h-[44px]"
              aria-label="Open filter menu"
            >
              <SlidersHorizontal size={18} className="text-[#9B9694]" />
              <span className="font-inter text-sm font-normal text-[#9B9694] uppercase tracking-[1.6px]">
                FILTERS
              </span>
            </button>

            {/* Sorting Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-[#F8F2EB] rounded-sm transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#9B9694]/40 min-h-[44px]"
                aria-label="Sort options"
              >
                <span className="font-inter text-sm font-normal text-[#9B9694] uppercase tracking-[1.6px]">
                  SORT • {sortOption.replace(/_/g, " ")}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#9B9694] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Sorting List Menu */}
              {isSortOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-[#FAF8F5] border border-[#E5E2DA] shadow-lg z-30 transition-all">
                  <div className="py-1">
                    {[
                      "FEATURED",
                      "BEST SELLING",
                      "NEWEST",
                      "PRICE LOW TO HIGH",
                      "PRICE HIGH TO LOW",
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortOption(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-inter text-xs tracking-wider uppercase transition-colors hover:bg-[#F8F2EB] ${
                          sortOption === option
                            ? "bg-[#F2EFE8] text-[#1A1A1A] font-semibold"
                            : "text-[#72706F]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE FILTER BADGES ROW */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {/* Type Tags */}
              {appliedFilters.types.length < 3 &&
                appliedFilters.types.map((type) => (
                  <button
                    key={type}
                    onClick={() => removeTypeFilter(type)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E2DA] rounded-full text-xs font-inter text-[#2C2A29] hover:bg-[#F2EFE8] transition-colors"
                  >
                    {type}
                    <X size={12} className="text-[#9B9694]" />
                  </button>
                ))}

              {/* Subcategories Tags */}
              {appliedFilters.selectedSubCats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => removeSubCatFilter(cat)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E2DA] rounded-full text-xs font-inter text-[#2C2A29] hover:bg-[#F2EFE8] transition-colors"
                >
                  {cat}
                  <X size={12} className="text-[#9B9694]" />
                </button>
              ))}

              {/* Price Tags */}
              {(appliedFilters.minPrice > 0 ||
                appliedFilters.maxPrice < 1000) && (
                <button
                  onClick={resetPriceFilter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E2DA] rounded-full text-xs font-inter text-[#2C2A29] hover:bg-[#F2EFE8] transition-colors"
                >
                  ${appliedFilters.minPrice} - ${appliedFilters.maxPrice}
                  <X size={12} className="text-[#9B9694]" />
                </button>
              )}

              {/* Availability Tags */}
              {appliedFilters.availability.map((avail) => (
                <button
                  key={avail}
                  onClick={() => removeAvailabilityFilter(avail)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#E5E2DA] rounded-full text-xs font-inter text-[#2C2A29] hover:bg-[#F2EFE8] transition-colors"
                >
                  {avail}
                  <X size={12} className="text-[#9B9694]" />
                </button>
              ))}

              {/* CLEAR ALL BUTTON */}
              <button
                onClick={clearAllFilters}
                className="font-inter text-xs font-semibold text-[#D32F2F] hover:text-[#b02525] uppercase tracking-[1.2px] ml-2 transition-colors duration-150"
              >
                CLEAR ALL
              </button>
            </div>
          )}

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10">
            {isLoading ? (
              // Skeleton Loaders
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="aspect-3/4 bg-[#F2EFE8] border border-[#E5E2DA] rounded-sm mb-3" />
                  <div className="h-4 bg-[#E5E2DA] rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-[#E5E2DA] rounded w-1/2 mx-auto" />
                </div>
              ))
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    imageProps: { loading: "lazy", decoding: "async" },
                  }}
                />
              ))
            ) : (
              // Empty State
              <div className="col-span-full text-center py-20 bg-[#FAF8F5]/50 border border-dashed border-[#E5E2DA] rounded-md">
                <p className="font-cormorant text-2xl text-[#72706F] italic">
                  No products found matching your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 font-inter text-xs font-semibold text-[#1A1A1A] underline uppercase tracking-widest hover:text-[#9B9694] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {sortedProducts.length > 0 && !isLoading && (
            <div className="mt-12 sm:mt-16 md:mt-20 w-full flex justify-center sm:justify-end">
              <Pagination01
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </Container>
      </section>

      {/* 3. SLIDE-OUT FILTER SIDEBAR DRAWER */}
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isFilterOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer Panel Container */}
      <div
        className={`fixed top-0 left-0 h-full w-[310px] sm:w-[360px] bg-[#FAF8F5] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E2DA]">
          <h3 className="font-cormorant text-2xl font-normal tracking-wide text-[#1A1A1A]">
            Filters
          </h3>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-[#72706F] hover:text-[#1A1A1A] transition-colors rounded-full hover:bg-[#F2EFE8]"
            aria-label="Close filters panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* A. PRODUCT TYPE ACCORDION */}
          <div className="border-b border-[#E5E2DA] pb-4">
            <button
              onClick={() => toggleSection("productType")}
              className="w-full flex items-center justify-between font-cormorant text-lg font-normal text-[#1A1A1A] py-1 text-left"
            >
              <span>Product Type</span>
              {openSections.productType ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {openSections.productType && (
              <div className="space-y-3 mt-4 animate-fadeIn">
                {(categories.length > 0
                  ? Array.from(new Set(categories.map((c) => c.productType || c.name)))
                  : ["Men", "Women", "Perfumes"]
                ).map((type) => {
                  const isChecked = tempFilters.types.includes(type);
                  return (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTempType(type)}
                        className="sr-only"
                      />
                      <div
                        className={`w-[18px] h-[18px] border border-[#D9D5D2] flex items-center justify-center transition-colors group-hover:border-[#1A1A1A] ${
                          isChecked
                            ? "bg-[#1A1A1A] border-[#1A1A1A]"
                            : "bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-inter text-xs text-[#72706F] tracking-wide group-hover:text-[#1A1A1A] transition-colors leading-none">
                        {type}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* DYNAMIC CATEGORY ACCORDIONS */}
          {(categories.length > 0
            ? categories
            : [
                {
                  _id: "men_fallback",
                  name: "Men",
                  subCategories: [
                    "T-Shirts",
                    "Drop Shoulder T-Shirts",
                    "Formal Shirts",
                    "Casual Shirts",
                    "Panjabi",
                  ],
                },
                {
                  _id: "women_fallback",
                  name: "Women",
                  subCategories: ["T-Shirts", "Kamij", "Western Wear", "Deshi Wear"],
                },
              ]
          ).map((c) => {
            const sectionKey = `cat_${c._id}`;
            const isOpen = openSections[sectionKey] !== false; // Default to open
            return (
              <div key={c._id} className="border-b border-[#E5E2DA] pb-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between font-cormorant text-lg font-normal text-[#1A1A1A] py-1 text-left"
                >
                  <span>{c.name}'s Category</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isOpen && (
                  <div className="space-y-3 mt-4">
                    {c.subCategories?.map((cat) => {
                      const isChecked = tempFilters.selectedSubCats.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTempSubCat(cat)}
                            className="sr-only"
                          />
                          <div
                            className={`w-[18px] h-[18px] border border-[#D9D5D2] flex items-center justify-center transition-colors group-hover:border-[#1A1A1A] ${
                              isChecked
                                ? "bg-[#1A1A1A] border-[#1A1A1A]"
                                : "bg-transparent"
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="font-inter text-xs text-[#72706F] tracking-wide group-hover:text-[#1A1A1A] transition-colors leading-none">
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* D. PRICE ACCORDION */}
          <div className="border-b border-[#E5E2DA] pb-5">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between font-cormorant text-lg font-normal text-[#1A1A1A] py-1 text-left"
            >
              <span>Price</span>
              {openSections.price ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {openSections.price && (
              <div className="mt-4">
                {/* Double Handle Range Slider */}
                <div className="relative w-full h-1 mt-6 bg-[#E5E2DA] rounded-full">
                  {/* Active highlight track */}
                  <div
                    className="absolute h-full bg-[#1F3E35] rounded-full"
                    style={{
                      left: `${minPercent}%`,
                      right: `${100 - maxPercent}%`,
                    }}
                  />
                  {/* Slider inputs overlayed */}
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={tempFilters.minPrice}
                    onChange={(e) => {
                      const val = Math.min(
                        Number(e.target.value),
                        tempFilters.maxPrice - 50,
                      );
                      setTempFilters((prev) => ({ ...prev, minPrice: val }));
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FDFAF4] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1F3E35] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FDFAF4] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1F3E35]"
                    style={{ top: "-6px" }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={tempFilters.maxPrice}
                    onChange={(e) => {
                      const val = Math.max(
                        Number(e.target.value),
                        tempFilters.minPrice + 50,
                      );
                      setTempFilters((prev) => ({ ...prev, maxPrice: val }));
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FDFAF4] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1F3E35] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FDFAF4] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1F3E35]"
                    style={{ top: "-6px" }}
                  />
                </div>

                {/* Min / Max Editable Inputs */}
                <div className="flex gap-4 mt-6">
                  <div className="flex-1">
                    <span className="block font-inter text-[9px] text-[#9B9694] uppercase tracking-wider mb-1">
                      MIN PRICES
                    </span>
                    <div className="flex items-center border-b border-[#D9D5D2] py-1">
                      <span className="font-inter text-xs text-[#9B9694] mr-1">
                        $
                      </span>
                      <input
                        type="number"
                        value={tempFilters.minPrice}
                        min="0"
                        max="1000"
                        onChange={(e) => {
                          const val = Math.min(
                            Number(e.target.value),
                            tempFilters.maxPrice - 50,
                          );
                          setTempFilters((prev) => ({
                            ...prev,
                            minPrice: isNaN(val) ? 0 : val,
                          }));
                        }}
                        className="w-full font-inter text-xs text-[#1A1A1A] bg-transparent outline-none border-none p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="block font-inter text-[9px] text-[#9B9694] uppercase tracking-wider mb-1">
                      MAX PRICES
                    </span>
                    <div className="flex items-center border-b border-[#D9D5D2] py-1">
                      <span className="font-inter text-xs text-[#9B9694] mr-1">
                        $
                      </span>
                      <input
                        type="number"
                        value={tempFilters.maxPrice}
                        min="0"
                        max="1000"
                        onChange={(e) => {
                          const val = Math.max(
                            Number(e.target.value),
                            tempFilters.minPrice + 50,
                          );
                          setTempFilters((prev) => ({
                            ...prev,
                            maxPrice: isNaN(val) ? 1000 : val,
                          }));
                        }}
                        className="w-full font-inter text-xs text-[#1A1A1A] bg-transparent outline-none border-none p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Price quick sorting buttons */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => setSortOption("PRICE LOW TO HIGH")}
                    className={`border px-3 py-2 text-center font-inter text-[10px] tracking-wider uppercase transition-colors duration-200 ${
                      sortOption === "PRICE LOW TO HIGH"
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "border-[#E5E2DA] text-[#72706F] hover:bg-[#F2EFE8] hover:text-[#1A1A1A]"
                    }`}
                  >
                    Low To High
                  </button>
                  <button
                    onClick={() => setSortOption("PRICE HIGH TO LOW")}
                    className={`border px-3 py-2 text-center font-inter text-[10px] tracking-wider uppercase transition-colors duration-200 ${
                      sortOption === "PRICE HIGH TO LOW"
                        ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
                        : "border-[#E5E2DA] text-[#72706F] hover:bg-[#F2EFE8] hover:text-[#1A1A1A]"
                    }`}
                  >
                    High To Low
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* E. AVAILABILITY ACCORDION */}
          <div className="border-b border-[#E5E2DA] pb-4">
            <button
              onClick={() => toggleSection("availability")}
              className="w-full flex items-center justify-between font-cormorant text-lg font-normal text-[#1A1A1A] py-1 text-left"
            >
              <span>Availability</span>
              {openSections.availability ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {openSections.availability && (
              <div className="space-y-3 mt-4">
                {["In Stock", "Limited Edition", "New Arrival"].map((avail) => {
                  const isChecked = tempFilters.availability.includes(avail);
                  return (
                    <label
                      key={avail}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTempAvailability(avail)}
                        className="sr-only"
                      />
                      <div
                        className={`w-[18px] h-[18px] border border-[#D9D5D2] flex items-center justify-center transition-colors group-hover:border-[#1A1A1A] ${
                          isChecked
                            ? "bg-[#1A1A1A] border-[#1A1A1A]"
                            : "bg-transparent"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-inter text-xs text-[#72706F] tracking-wide group-hover:text-[#1A1A1A] transition-colors leading-none">
                        {avail}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Sticky Footer Action Buttons */}
        <div className="border-t border-[#E5E2DA] p-6 bg-[#FAF8F5] space-y-3">
          <button
            onClick={applyFilters}
            className="w-full bg-[#1A1A1A] hover:bg-[#2C2A29] text-white py-3 text-center text-xs font-semibold tracking-[1.6px] uppercase transition-colors duration-200"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="w-full bg-transparent hover:bg-[#F2EFE8] border border-[#E5E2DA] text-[#1A1A1A] py-3 text-center text-xs font-semibold tracking-[1.6px] uppercase transition-colors duration-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
