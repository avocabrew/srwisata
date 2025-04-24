import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#231E1B] text-white py-4">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-6 h-6 text-[#2BA79D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg md:text-xl font-bold">TripMatch</h3>
          </div>
          <p className="text-gray-400 text-center text-base md:text-lg mb-2">
            Temukan keajaiban wisata Indonesia bersama kami
          </p>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400 text-base md:text-lg">
          <p>&copy; 2025 TripMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
