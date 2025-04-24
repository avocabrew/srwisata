import React from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg
              className="w-8 h-8 text-[#2BA79D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-[#2BA79D]">TripMatch</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg text-[#2BA79D] bg-[#2BA79D]/10 px-4 py-2 rounded-full font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/recommendation"
              className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors px-4 py-2 rounded-full"
            >
              Rekomendasi
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#231E1B] hover:text-[#2BA79D] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-40 opacity-100 mt-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-4 pb-4">
            <Link
              href="/"
              className="text-lg text-[#2BA79D] bg-[#2BA79D]/10 px-4 py-2 rounded-full font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/recommendation"
              className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors px-4 py-2 rounded-full"
            >
              Rekomendasi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
