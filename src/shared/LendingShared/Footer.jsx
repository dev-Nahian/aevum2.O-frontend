import { Link } from "react-router-dom";
import Container from "@/components/common/Container";
import Logo from "@/assets/Images/footerLogo.png";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";

export default function Footer() {
    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription
    };

    const linkColumns = [
        {
            title: "MAISON",
            links: [
                { label: "About AEVUM", href: "#" },
                { label: "Collections", href: "#" },
                { label: "New Arrivals", href: "#" },
                { label: "Contact", href: "#" }
            ]
        },
        {
            title: "CLIENT SERVICES",
            links: [
                { label: "My Account", href: "#" },
                { label: "Shopping Bag", href: "#" },
                { label: "Wishlist", href: "#" },
                { label: "Shipping & Returns", href: "#" }
            ]
        },
        {
            title: "LEGAL",
            links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Settings", href: "#" }
            ]
        }
    ];

    const socialLinks = [
        { icon: FaInstagram, href: "#", label: "Instagram" },
        { icon: FaFacebookF, href: "#", label: "Facebook" },
        { icon: FaYoutube, href: "#", label: "YouTube" }
    ];

    return (
        <footer className="bg-[#0E0E0D] text-white pt-16 sm:pt-20 pb-10 sm:pb-12 select-none border-t border-white/5">
            <Container>
                {/* Upper Footer: Branding & Links */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 sm:pb-16">
                    {/* Left Column: Logo, Description & Newsletter */}
                    <div className="lg:col-span-5 flex flex-col items-start">
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center mb-5 sm:mb-6 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm"
                        >
                            <img
                                className="h-[40px] sm:h-[48px] w-auto object-contain"
                                src={Logo}
                                alt="AEVUM Logo"
                            />
                        </Link>

                        {/* Description */}
                        <p className="font-inter text-[12px] sm:text-sm leading-relaxed text-white/50 font-light tracking-[0.02em] mb-8 sm:mb-10 max-w-[95%] lg:max-w-[420px]">
                            A house of timeless luxury — curated fashion, refined elegance, and signature fragrance for the modern era.
                        </p>

                        {/* Newsletter Signup */}
                        <div className="w-full max-w-[380px]">
                            <span className="font-inter text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-white/40 uppercase block mb-3 sm:mb-4">
                                NEWSLETTER
                            </span>
                            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-white/20 pb-2 focus-within:border-white transition-colors duration-300">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    required
                                    className="w-full bg-transparent text-white placeholder-white/30 font-inter text-[13px] sm:text-sm font-light tracking-[0.05em] pr-20 sm:pr-24 py-1 outline-none border-none focus:outline-none focus:ring-0"
                                    aria-label="Email address for newsletter"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 font-inter text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-white/70 hover:text-white transition-colors duration-300 uppercase cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm"
                                    aria-label="Subscribe to newsletter"
                                >
                                    SUBSCRIBE
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Columns: Links */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 lg:gap-12">
                        {linkColumns.map((column, colIdx) => (
                            <div key={colIdx} className="flex flex-col items-start">
                                <span className="font-inter text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-white/40 uppercase mb-5 sm:mb-6">
                                    {column.title}
                                </span>
                                <ul className="space-y-3 sm:space-y-4">
                                    {column.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link 
                                                to={link.href} 
                                                className="font-inter text-[12px] sm:text-sm font-light tracking-[0.02em] text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm py-1"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lower Footer: Copyright & Socials */}
                <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <span className="font-inter text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.2em] text-white/40 uppercase text-center sm:text-left">
                        © 2026 AEVUM MAISON. ALL RIGHTS RESERVED.
                    </span>

                    {/* Social Links */}
                    <div className="flex items-center gap-5 sm:gap-6 text-white/40">
                        {socialLinks.map((social, idx) => {
                            const Icon = social.icon;
                            return (
                                <a 
                                    key={idx}
                                    href={social.href} 
                                    aria-label={social.label}
                                    className="hover:text-white hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                >
                                    <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </Container>
        </footer>
    );
}