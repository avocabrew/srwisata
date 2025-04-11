"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

const locations = [
  "Kecamatan Petang",
  "Kecamatan Abiansemal",
  "Kecamatan Mengwi",
  "Kecamatan Kuta Utara",
  "Kecamatan Kuta",
  "Kecamatan Kuta Selatan",
];

const categories = [
  "Wisata petualangan",
  "Wisata alam",
  "Wisata spiritual",
  "Seni & Budaya",
];

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  ticketPrice: number;
  location: string;
  category: string;
  distance?: number;
  score: number;
}

interface NormalizedValues {
  rating: number;
  distance: number;
  price: number;
  categoryMatch: number;
}

export default function RecommendationPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [recommendations, setRecommendations] = useState<Destination[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [considerDistance, setConsiderDistance] = React.useState(false);

  const handleGetRecommendations = () => {
    // Simulasi data rekomendasi (nanti akan diganti dengan data dari API)
    const mockRecommendations = [
      {
        id: 1,
        name: "Pura Taman Ayun",
        description:
          "Pura kerajaan dengan arsitektur tradisional Bali yang indah",
        image: "/images/taman-ayun.jpg",
        rating: 4.8,
        ticketPrice: 80000,
        location: "Kecamatan Mengwi",
        category: "Wisata spiritual",
        score: 0,
      },
      {
        id: 2,
        name: "Air Terjun Nungnung",
        description: "Air terjun spektakuler dengan ketinggian 50 meter",
        image: "/images/nungnung.jpg",
        rating: 4.6,
        ticketPrice: 50000,
        location: "Kecamatan Petang",
        category: "Wisata alam",
        score: 0,
      },
    ];

    setRecommendations(mockRecommendations);
    setShowResults(true);
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setConsiderDistance(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert(
            "Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan."
          );
        }
      );
    } else {
      alert("Browser Anda tidak mendukung geolocation");
      setIsLoadingLocation(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam kilometer
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const calculateSAW = (destinations: Destination[]): Destination[] => {
    // Bobot kriteria (total = 1)
    const weights = {
      rating: 0.3, // Bobot rating
      distance: 0.3, // Bobot jarak
      price: 0.2, // Bobot harga
      category: 0.2, // Bobot kesesuaian kategori
    };

    // Cari nilai max dan min untuk normalisasi
    const maxRating = Math.max(...destinations.map((d) => d.rating));
    const minPrice = Math.min(...destinations.map((d) => d.ticketPrice));
    const maxDistance = Math.max(
      ...destinations.filter((d) => d.distance).map((d) => d.distance || 0)
    );

    // Normalisasi dan hitung skor SAW
    return destinations
      .map((dest) => {
        // Normalisasi nilai (0-1)
        const normalized: NormalizedValues = {
          rating: dest.rating / maxRating, // Benefit criteria
          distance: dest.distance ? 1 - dest.distance / maxDistance : 0, // Cost criteria
          price: minPrice / dest.ticketPrice, // Cost criteria
          categoryMatch: selectedCategory
            .toLowerCase()
            .includes(dest.category.toLowerCase())
            ? 1
            : 0,
        };

        // Hitung skor SAW
        const sawScore =
          normalized.rating * weights.rating +
          normalized.distance * weights.distance +
          normalized.price * weights.price +
          normalized.categoryMatch * weights.category;

        return {
          ...dest,
          score: sawScore || 0,
        };
      })
      .sort((a: Destination, b: Destination) => b.score - a.score);
  };

  const handleRecommendation = async () => {
    const query = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX d: <http://www.semanticweb.org/dewac/ontologies/2025/2/untitled-ontology-4#>

      SELECT * WHERE {
        ?namaDestinasi rdf:type d:Destinasi.
        ?namaDestinasi d:Lokasi ?lokasi.
        ?namaDestinasi d:Nama ?namaTempat.
        ?namaDestinasi d:Rating ?rating.
        ?namaDestinasi d:Kategori ?kategori.
        ?namaDestinasi d:Latitude ?lat.
        ?namaDestinasi d:Longitude ?lng.
        ?namaDestinasi d:TicketPrice ?ticketPrice.
      }
    `;

    try {
      const response = await fetch(
        "http://localhost:3030/destinasiWisata/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: `query=${encodeURIComponent(query)}`,
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      let destinations: Destination[] = data.results.bindings.map(
        (item: any) => {
          const destLat = parseFloat(item.lat.value);
          const destLng = parseFloat(item.lng.value);
          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                destLat,
                destLng
              )
            : undefined;

          return {
            id: parseInt(item.namaDestinasi.value.split("#")[1]),
            name: item.namaTempat.value,
            description: "Deskripsi akan ditambahkan",
            image: "/images/default.jpg",
            rating: parseFloat(item.rating.value),
            ticketPrice: parseInt(item.ticketPrice.value),
            location: item.lokasi.value,
            category: item.kategori.value,
            distance: distance,
            score: 0,
          };
        }
      );

      // Terapkan metode SAW
      const rankedDestinations = calculateSAW(destinations);
      setRecommendations(rankedDestinations);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#ECE7E3]">
      {/* Navbar */}
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
                className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors px-4 py-2 rounded-full"
              >
                Beranda
              </Link>
              <Link
                href="/recommendation"
                className="text-lg text-[#2BA79D] bg-[#2BA79D]/10 px-4 py-2 rounded-full font-medium"
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
                className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors px-4 py-2 rounded-full"
              >
                Beranda
              </Link>
              <Link
                href="/recommendation"
                className="text-lg text-[#2BA79D] bg-[#2BA79D]/10 px-4 py-2 rounded-full font-medium"
              >
                Rekomendasi
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#231E1B] mb-8">
              Dapatkan Rekomendasi Wisata
            </h2>

            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[#231E1B] font-medium mb-2">
                    Lokasi
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent appearance-none bg-transparent"
                    >
                      <option value="">
                        Pilih lokasi yang ingin dikunjungi
                      </option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#231E1B] font-medium mb-2">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent appearance-none bg-transparent"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[#231E1B] font-medium mb-2">
                  Range Biaya
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: Number(e.target.value),
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent"
                      placeholder="Minimum"
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: Number(e.target.value),
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent"
                      placeholder="Maksimum"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={getUserLocation}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                      considerDistance
                        ? "bg-[#2BA79D] text-white"
                        : "bg-gray-100 text-gray-600"
                    } hover:bg-[#2BA79D] hover:text-white transition-colors`}
                    disabled={isLoadingLocation}
                  >
                    <FaLocationArrow
                      className={`w-4 h-4 ${
                        isLoadingLocation ? "animate-spin" : ""
                      }`}
                    />
                    <span>
                      {isLoadingLocation
                        ? "Mencari Lokasi..."
                        : "Pertimbangkan Jarak"}
                    </span>
                  </button>
                  {userLocation && (
                    <button
                      onClick={() => {
                        setUserLocation(null);
                        setConsiderDistance(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleRecommendation}
                className="w-full bg-[#2BA79D] text-white px-8 py-3 rounded-full hover:bg-[#2BA79D]/80 transition-colors text-lg font-medium"
              >
                Dapatkan Rekomendasi
              </button>
            </div>

            {/* Hasil Rekomendasi */}
            {showResults && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#231E1B] mb-6">
                  Rekomendasi Wisata Untukmu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((destination) => (
                    <div
                      key={destination.id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="relative h-48">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xl font-bold text-[#231E1B]">
                            {destination.name}
                          </h4>
                          <div className="flex items-center">
                            <svg
                              className="w-5 h-5 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium">
                              {destination.rating}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {destination.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#2BA79D] font-medium">
                            Rp {destination.ticketPrice.toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {destination.location}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                              {destination.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 mt-2">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          {destination.distance && (
                            <span className="ml-2 text-sm text-[#2BA79D]">
                              ({destination.distance.toFixed(1)} km)
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Skor Rekomendasi:{" "}
                          {Math.round(destination.score * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
