import { useState, useEffect } from "react";
import Container from "@/components/common/Container";
import Logo from "@/assets/Images/Logo.png";
import LogoBlack from "@/assets/Images/LogoBlack.png";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function  Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Select cart state and calculate quantity count
    const cartItems = useSelector((state) => state.cart?.cartItems || []);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Dark navbar for product & wishlist pages
    useEffect(() => {
        const currentPath = location.pathname;
        setIsDark(
            currentPath.includes("/product/") ||
            currentPath.includes("/wishlist") ||
            currentPath.includes("/auth") ||
            currentPath.includes("/checkout") ||
            currentPath.includes("/cart") ||
            currentPath.includes("/new-arrivals") ||
            currentPath.includes("/about")
        );
    }, [location]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    // Scroll transition for sticky navbar (desktop only)
    useEffect(() => {
        const handleScroll = () => {
            // Only track scroll on desktop to save mobile performance
            if (window.innerWidth >= 1024) {
                setIsScrolled(window.scrollY > 150);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "MEN", href: "/category/men" },
        { label: "WOMEN", href: "/category/women" },
        { label: "PERFUMES", href: "/category/perfumes" },
        { label: "NEW ARRIVALS", href: "/category/new-arrivals" },
        { label: "ABOUT", href: "/about" },
    ];

    // Shared icon base styles
    const iconBaseClass = "hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer";
    const iconColorDark = "text-black hover:text-black";
    const iconColorLight = "text-white hover:text-white";

    return (
        <>
            {/* 🔹 Primary Navbar (Transparent on Home, White on Wishlist/Product) */}
            <nav
                className={`z-40 w-full transition-all duration-300 ${
                    isDark
                        ? "relative bg-[#FDFAF4] border-b border-black/5 text-[#1C1B1A] py-4 shadow-sm"
                        : "absolute top-10 left-0 right-0 bg-transparent py-[24px] text-white"
                }`}
            >
                <Container>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center transition-opacity hover:opacity-90 z-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <img
                                className="h-[40px] sm:h-[50px] md:h-[60px] w-[180px] sm:w-[220px] md:w-[280px] object-contain"
                                src={isDark ? LogoBlack : Logo}
                                alt="AEVUM Logo"
                            />
                        </Link>

                        {/* 📱 Mobile Menu Toggle */}
                        <button
                            className={`lg:hidden z-50 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 ${
                                isDark ? "text-black hover:bg-black/10" : "text-white hover:bg-white/10"
                            }`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* 💻 Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className={`relative font-inter py-2 text-[16px] leading-[150%] tracking-[0.32px] font-medium transition-colors duration-300 group ${
                                        isDark ? "text-[#1C1B1A]" : "text-white"
                                    }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute bottom-0 left-0 w-full h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${
                                            isDark ? "bg-black" : "bg-white"
                                        }`}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* 💻 Desktop Icons + CTA */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                            <div className={`flex items-center gap-5 transition-colors ${isDark ? "text-black/80" : "text-white/80"}`}>
                                <Search size={20} strokeWidth={1.5} className={`${iconBaseClass} ${isDark ? iconColorDark : iconColorLight}`} />
                                <Link to="/wishlist">
                                    <Heart size={20} strokeWidth={1.5} className={`${iconBaseClass} ${isDark ? iconColorDark : iconColorLight}`} />
                                </Link>
                                <Link to="/cart" className="relative flex items-center justify-center">
                                    <ShoppingBag size={20} strokeWidth={1.5} className={`${iconBaseClass} ${isDark ? iconColorDark : iconColorLight}`} />
                                    {cartCount > 0 && (
                                        <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                            isDark ? "bg-[#1C1B1A] text-[#FDFAF4]" : "bg-[#FDFAF4] text-[#1C1B1A]"
                                        }`}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                            <Link
                                to="/auth/signup"
                                className={`px-7 py-2.5 text-[12px] font-medium tracking-[0.2em] uppercase rounded-none bg-transparent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/20 ${
                                    isDark
                                        ? "border border-black/40 hover:border-black text-black hover:bg-black hover:text-white"
                                        : "border border-white/40 hover:border-white text-white hover:bg-white hover:text-black"
                                }`}
                            >
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </Container>

                {/* 📱 Mobile Menu Overlay (Slides Down) */}
                <div
                    className={`lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <Container className="pt-24 pb-8">
                        <div className="flex flex-col gap-6 mt-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="text-[16px] font-medium py-3 border-b border-white/10 text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile Icons - White for dark overlay */}
                            <div className="flex items-center gap-3 pt-4">
                                <Search size={20} strokeWidth={1.5} className="cursor-pointer text-white/75 hover:text-white transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center" />
                                <Link to="/wishlist" className="cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Heart size={24} strokeWidth={1.5} className="text-white/75 hover:text-white transition-colors" />
                                </Link>
                                <Link to="/cart" className="relative min-w-[28px] min-h-[28px] flex items-center justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <ShoppingBag size={20} strokeWidth={1.5} className="text-white/75 hover:text-white transition-colors" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#FDFAF4] text-[#1C1B1A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Mobile CTA Button - White style for dark overlay */}
                            <Link to="/auth/signup" className="mt-4 w-full border border-white/60 hover:border-white px-7 py-3 text-[13px] font-medium tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-all focus:outline-none focus:ring-2 focus:ring-white/30">
                                SIGN UP
                            </Link>
                        </div>
                    </Container>
                </div>
            </nav>

            {/* 🔹 Sticky White Navbar (Desktop Only - appears on scroll) */}
            <nav
                className={`hidden lg:block fixed top-0 left-0 right-0 z-50 w-full py-4 bg-[#FDFAF4] backdrop-blur-md shadow-md border-b border-black/5 text-[#1C1B1A] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
                    isScrolled
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "-translate-y-full opacity-0 pointer-events-none"
                }`}
            >
                <Container>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center transition-opacity hover:opacity-90 z-50">
                            <img
                                className="h-[40px] sm:h-[50px] md:h-[60px] w-[180px] sm:w-[220px] md:w-[280px] object-contain"
                                src={LogoBlack}
                                alt="AEVUM Logo"
                            />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className="relative font-inter py-2 text-[16px] leading-[150%] tracking-[0.32px] font-medium text-[#1C1B1A] transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-black/20 rounded-sm"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-full h-px bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Icons + CTA */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                            <div className="flex items-center gap-5 text-black/80">
                                <Search size={20} strokeWidth={1.5} className={`${iconBaseClass} hover:text-black`} />
                                <Link to="/wishlist">
                                    <Heart size={20} strokeWidth={1.5} className={`${iconBaseClass} hover:text-black`} />
                                </Link>
                                <Link to="/cart" className="relative flex items-center justify-center">
                                    <ShoppingBag size={20} strokeWidth={1.5} className={`${iconBaseClass} hover:text-black`} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#1C1B1A] text-[#FDFAF4] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                            <Link to="/auth/signup" className="border border-black/40 hover:border-black px-7 py-2.5 text-[12px] font-medium tracking-[0.2em] uppercase text-black bg-transparent hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/20">
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </Container>
            </nav>
        </>
    );
}