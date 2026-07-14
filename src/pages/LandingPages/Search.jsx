import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, X, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import ProductCard from "@/components/common/ProductCard";
import { productAPI } from "@/lib/apiClient";
import toast from "react-hot-toast";

const POPULAR_SEARCHES = ["Men", "Women", "Fragrance", "New Arrivals"];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize internal search query state with search parameters
  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const performSearch = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const data = await productAPI.getAll({ search: query });
      setProducts(data.products || data);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Failed to load search results.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run search when queryParam changes
  useEffect(() => {
    if (queryParam.trim()) {
      performSearch(queryParam);
    } else {
      setProducts([]);
    }
  }, [queryParam, performSearch]);

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await productAPI.getSuggestions(searchQuery);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Suggestions fetch error:", err);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = searchQuery.trim();
    setSearchParams(cleanQuery ? { q: cleanQuery } : {});
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
    setProducts([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSearchParams({ q: suggestion });
    setShowSuggestions(false);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 min-h-[85vh] bg-[#FDFAF4]">
      <Container>
        {/* Search Input Section */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-14 search-container relative">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search our collection..."
              className="w-full pl-6 pr-14 py-4 sm:py-5 bg-white border border-[#E5E2DA] focus:border-[#1A1A1A] text-sm sm:text-base font-inter text-[#1A1A1A] placeholder-[#72706F]/60 rounded-full shadow-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-[#1A1A1A] tracking-wide"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-[#72706F] hover:text-[#1A1A1A] transition-colors rounded-full focus:outline-none"
                  aria-label="Clear search query"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                className="p-2 bg-[#1A1A1A] hover:bg-[#2C2A29] text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A1A1A]"
                aria-label="Submit search"
              >
                <SearchIcon size={16} />
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#E5E2DA] rounded-2xl shadow-xl z-30 max-h-[380px] overflow-y-auto divide-y divide-[#E5E2DA]/40">
              {suggestions.map((item) => (
                <Link
                  key={item._id || item.id}
                  to={`/product/${item.id || item._id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-4 p-3 hover:bg-[#F2EFE8]/40 transition-colors duration-200"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-14 object-cover bg-[#F2EFE8] rounded-sm"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-[#F2EFE8] flex items-center justify-center text-[#72706F]/50">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-inter text-sm font-medium text-[#1A1A1A] truncate">
                      {item.title}
                    </h5>
                    <p className="font-inter text-[10px] text-[#72706F] uppercase tracking-wider mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <div className="font-inter text-sm font-semibold text-[#1A1A1A] pr-2">
                    ৳{item.price}
                  </div>
                </Link>
              ))}
              <div className="p-3 bg-[#FDFAF4] text-center rounded-b-2xl">
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-inter font-semibold text-[#1A1A1A] hover:underline"
                >
                  See all results for "{searchQuery}"
                </button>
              </div>
            </div>
          )}

          {/* Popular searches list */}
          <div className="mt-4 flex flex-wrap items-center gap-3 justify-center">
            <span className="font-inter text-[10px] sm:text-xs text-[#72706F] uppercase tracking-wider">
              Popular Searches:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className="px-4 py-1.5 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#E5E2DA] hover:border-[#1A1A1A] text-[10px] sm:text-xs text-[#1A1A1A] rounded-full transition-all duration-200 tracking-wide font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E5E2DA]">
          <h4 className="font-inter text-xs sm:text-sm font-normal text-[#72706F] leading-tight uppercase tracking-[2px]">
            {queryParam.trim() ? (
              <>
                Search Results For: <span className="text-[#1A1A1A] font-bold">"{queryParam}"</span>
              </>
            ) : (
              "Explore Our Collection"
            )}
          </h4>
          {queryParam.trim() && !isLoading && (
            <span className="font-inter text-xs text-[#72706F] tracking-wide">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </span>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10">
          {isLoading ? (
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
                key={product.id || product._id}
                product={{
                  ...product,
                  imageProps: { loading: "lazy", decoding: "async" },
                }}
              />
            ))
          ) : queryParam.trim() ? (
            <div className="col-span-full text-center py-20 bg-white border border-[#E5E2DA] rounded-sm shadow-sm px-6">
              <Sparkles size={32} className="text-[#72706F]/45 mx-auto mb-4" />
              <p className="font-cormorant text-xl text-[#1A1A1A] italic mb-2">
                No matching pieces found
              </p>
              <p className="font-inter text-[#72706F] text-xs max-w-md mx-auto">
                We couldn't find matches for "{queryParam}". Check your spelling or search using more general terms.
              </p>
            </div>
          ) : (
            <div className="col-span-full text-center py-20 bg-white/40 border border-dashed border-[#E5E2DA] rounded-sm px-6">
              <SearchIcon size={32} className="text-[#72706F]/45 mx-auto mb-4" />
              <p className="font-cormorant text-xl text-[#1A1A1A] italic mb-1">
                Begin your search above
              </p>
              <p className="font-inter text-[#72706F] text-xs">
                Explore our curated range of clothing, accessories, and signature fragrances.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
