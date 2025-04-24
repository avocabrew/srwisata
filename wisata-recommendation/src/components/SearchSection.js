import React from "react";
import { FaLocationArrow } from "react-icons/fa";

const SearchSection = ({
  selectedLocation,
  setSelectedLocation,
  selectedCategory,
  setSelectedCategory,
  handleSearch,
  getUserLocation,
  isLoadingLocation,
}) => {
  return (
    <section className="pt-32 pb-16 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2BA79D]/90 to-[#2BA79D]/80 z-10" />

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
            Sistem Rekomendasi Destinasi Wisata Kabupaten Badung
          </h1>
          <p className="text-xl mb-10 text-white">
            Jelajahi destinasi wisata terbaik dengan rekomendasi personal untuk
            pengalaman tak terlupakan
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-[#231E1B] text-2xl font-semibold mb-6 text-center">
              Cari Destinasi Impianmu
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <select
                  className={`w-full pl-12 pr-10 py-3 text-base bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2BA79D]/20 [&>option]:bg-white [&>option]:py-2 [&>option]:px-4 [&>option]:text-gray-800 [&>option]:cursor-pointer appearance-none ${
                    selectedLocation
                      ? "text-gray-800 font-normal"
                      : "text-gray-400 font-light"
                  }`}
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Pilih Lokasi</option>
                  <option value="petang">Kecamatan Petang</option>
                  <option value="abiansemal">Kecamatan Abiansemal</option>
                  <option value="mengwi">Kecamatan Mengwi</option>
                  <option value="kuta-utara">Kecamatan Kuta Utara</option>
                  <option value="kuta">Kecamatan Kuta</option>
                  <option value="kuta-selatan">Kecamatan Kuta Selatan</option>
                </select>
              </div>
              <div className="flex-1">
                <select
                  className={`w-full pl-12 pr-10 py-3 text-base bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2BA79D]/20 [&>option]:bg-white [&>option]:py-2 [&>option]:px-4 [&>option]:text-gray-800 [&>option]:cursor-pointer appearance-none ${
                    selectedCategory
                      ? "text-gray-800 font-normal"
                      : "text-gray-400 font-light"
                  }`}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="petualangan">Wisata petualangan</option>
                  <option value="alam">Wisata alam</option>
                  <option value="spiritual">Wisata spiritual</option>
                  <option value="seni-budaya">Seni & Budaya</option>
                </select>
              </div>
              <div className="md:w-auto flex items-center justify-center w-full gap-2">
                <button
                  onClick={getUserLocation}
                  className="bg-[#2BA79D] text-white px-6 py-3 text-base rounded-full hover:bg-[#2BA79D]/90 transition-colors flex items-center justify-center gap-2"
                  disabled={isLoadingLocation}
                >
                  <FaLocationArrow
                    className={`w-5 h-5 ${
                      isLoadingLocation ? "animate-spin" : ""
                    }`}
                  />
                  {isLoadingLocation ? "Mencari..." : "Lokasi Terdekat"}
                </button>

                <button
                  onClick={handleSearch}
                  className="bg-[#2BA79D] text-white px-8 py-3 text-base rounded-full hover:bg-[#2BA79D]/90 transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
