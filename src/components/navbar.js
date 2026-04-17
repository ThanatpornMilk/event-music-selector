/**
 * Navbar Component
 * 
 * Provides main navigation for the application, featuring responsive
 * mobile-friendly menus and active path highlighting.
 */

'use client'
import React, { useState } from "react";
import { FaHome, FaHeart, FaMusic, FaBars, FaTimes } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";

/**
 * NavItem component for horizontal and vertical navigation.
 * Moved outside the main component for performance and cleaner structure.
 */
const NavItem = ({ onClick, icon, label, path, currentPath }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 cursor-pointer transition-colors outline-none px-2 py-1 ${currentPath === path ? "text-yellow-300 font-bold" : "hover:text-yellow-300"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Universal navigation handler that manages state cleanup
   * and mobile menu closing.
   */
  const navigateTo = (path) => {
    if (path === "/") {
      sessionStorage.removeItem("playlistReady");
    }
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-primary-light text-white p-4 flex items-center justify-between border-b-4 border-white z-50">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => navigateTo("/")}
          className="outline-none focus:ring-2 focus:ring-white/50 rounded-xl overflow-hidden active:scale-95 transition-transform"
        >
          <img
            src="/image/logo.png"
            alt="Event Music Selector"
            className="h-14"
          />
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Items (Desktop) */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 mt-4 space-x-6 text-xl">
        <NavItem onClick={() => navigateTo("/")} icon={<FaHome />} label="Home" path="/" currentPath={pathname} />
        <NavItem onClick={() => navigateTo("/playlist")} icon={<FaMusic />} label="Playlist" path="/playlist" currentPath={pathname} />
        <NavItem onClick={() => navigateTo("/favorite")} icon={<FaHeart />} label="Favorite" path="/favorite" currentPath={pathname} />
      </div>

      {/* Dropdown Menu (Mobile) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[70px] left-0 w-full bg-primary-light flex flex-col items-center space-y-4 py-6 text-lg shadow-lg border-b border-white/20">
          <NavItem onClick={() => navigateTo("/")} icon={<FaHome />} label="Home" path="/" currentPath={pathname} />
          <NavItem onClick={() => navigateTo("/playlist")} icon={<FaMusic />} label="Playlist" path="/playlist" currentPath={pathname} />
          <NavItem onClick={() => navigateTo("/favorite")} icon={<FaHeart />} label="Favorite" path="/favorite" currentPath={pathname} />
        </div>
      )}
    </nav>
  );
}
