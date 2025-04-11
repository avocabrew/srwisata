"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaPlane,
  FaTicketAlt,
  FaBox,
  FaBolt,
  FaStar,
  FaHiking,
  FaTree,
  FaPray,
  FaPaintBrush,
  FaLocationArrow,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [showAllDestinations, setShowAllDestinations] = React.useState(false);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [destinations, setDestinations] = React.useState<any[]>([]);
  const [userLocation, setUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);

  const categories = [
    {
      name: "Wisata petualangan",
      icon: <FaHiking className="w-6 h-6" />,
    },
    {
      name: "Wisata alam",
      icon: <FaTree className="w-6 h-6" />,
    },
    {
      name: "Wisata spiritual",
      icon: <FaPray className="w-6 h-6" />,
    },
    {
      name: "Seni & Budaya",
      icon: <FaPaintBrush className="w-6 h-6" />,
    },
  ];

  const handleDetailClick = (destination: any) => {
    router.push(`/destination/${destination.id}`);
  };

  const handleSearch = () => {
    setIsSearching(true);

    // Filter destinations berdasarkan lokasi dan kategori
    let results = destinations;

    if (selectedLocation) {
      results = results.filter((dest) =>
        dest.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(
        (dest) => dest.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setSearchResults(results);
    setShowAllDestinations(true);

    // Scroll ke bagian hasil
    const destinationSection = document.getElementById("search-results");
    if (destinationSection) {
      destinationSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "wisata petualangan":
      case "petualangan":
        return "bg-orange-100 border-orange-200";
      case "wisata alam":
      case "alam":
        return "bg-emerald-100 border-emerald-200";
      case "wisata spiritual":
      case "spiritual":
        return "bg-purple-100 border-purple-200";
      case "seni & budaya":
      case "seni-budaya":
        return "bg-blue-100 border-blue-200";
      default:
        return "bg-white";
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "wisata petualangan":
      case "petualangan":
        return "text-orange-600";
      case "wisata alam":
      case "alam":
        return "text-emerald-600";
      case "wisata spiritual":
      case "spiritual":
        return "text-purple-600";
      case "seni & budaya":
      case "seni-budaya":
        return "text-blue-600";
      default:
        return "text-[#2BA79D]";
    }
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          findNearestDestinations(latitude, longitude);
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

  const findNearestDestinations = async (userLat: number, userLng: number) => {
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

      // Hitung jarak dan urutkan berdasarkan jarak terdekat
      const destinationsWithDistance = data.results.bindings
        .map((item: any) => {
          const destLat = parseFloat(item.lat.value);
          const destLng = parseFloat(item.lng.value);
          const distance = calculateDistance(
            userLat,
            userLng,
            destLat,
            destLng
          );

          return {
            id: item.namaDestinasi.value,
            name: item.namaTempat.value,
            description: "Deskripsi akan ditambahkan",
            image:
              "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop",
            rating: parseFloat(item.rating.value),
            location: item.lokasi.value,
            category: item.kategori.value,
            distance: distance,
            price: "Hubungi untuk info",
          };
        })
        .sort(
          (a: { distance: number }, b: { distance: number }) =>
            a.distance - b.distance
        );

      setSearchResults(destinationsWithDistance);
      setIsSearching(true);
    } catch (error) {
      console.error("Error fetching nearest destinations:", error);
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
    const d = R * c; // Jarak dalam kilometer
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Tambahkan useEffect untuk fetch data
  React.useEffect(() => {
    const fetchDestinations = async () => {
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

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Transform data ke format yang sesuai
        const transformedDestinations = data.results.bindings.map(
          (item: any, index: number) => ({
            id: index + 1,
            name: item.namaTempat.value,
            description: "Deskripsi akan ditambahkan", // Bisa ditambahkan jika ada di ontology
            image:
              "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop", // Default image
            rating: parseFloat(item.rating.value),
            location: item.lokasi.value,
            category: item.kategori.value,
            price: "Hubungi untuk info", // Bisa ditambahkan jika ada di ontology
          })
        );

        setDestinations(transformedDestinations);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const displayedDestinations = showAllDestinations
    ? destinations
    : destinations.slice(0, 3);

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

      {/* Hero Section with Search */}
      <section className="pt-32 pb-16 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2BA79D]/90 to-[#2BA79D]/80 z-10" />

        {/* Content */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Sistem Rekomendasi Destinasi Wisata Kabupaten Badung
            </h1>
            <p className="text-xl mb-10 text-white">
              Jelajahi destinasi wisata terbaik dengan rekomendasi personal
              untuk pengalaman tak terlupakan
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
              <h2 className="text-[#231E1B] text-2xl font-semibold mb-6 text-center">
                Cari Destinasi Impianmu
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <div className="absolute left-4">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                    </div>
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
                      <option value="kuta-selatan">
                        Kecamatan Kuta Selatan
                      </option>
                    </select>
                    <div className="absolute right-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                    {selectedLocation && (
                      <button
                        className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setSelectedLocation("")}
                      >
                        <svg
                          className="w-4 h-4"
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
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <div className="absolute left-4">
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
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
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
                    <div className="absolute right-4 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
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
                    {selectedCategory && (
                      <button
                        className="absolute right-12 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setSelectedCategory("")}
                      >
                        <svg
                          className="w-4 h-4"
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

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedCategory(category.name.toLowerCase());
                  handleSearch();
                }}
                className={`category-card p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.name.toLowerCase()
                    ? "bg-[#2BA79D]/10"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`category-icon-container mb-4 text-[#2BA79D] ${
                      selectedCategory === category.name.toLowerCase()
                        ? "text-[#2BA79D]"
                        : "text-gray-600"
                    }`}
                  >
                    <div className="category-icon">{category.icon}</div>
                  </div>
                  <span
                    className={`text-base font-medium text-center ${
                      selectedCategory === category.name.toLowerCase()
                        ? "text-[#2BA79D]"
                        : "text-gray-600"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="search-results" className="py-16 bg-[#ECE7E3]">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-[#231E1B]">
              {isSearching ? "Hasil Pencarian" : "Destinasi Populer"}
            </h2>
            <button
              className="text-lg text-[#2BA79D] hover:text-[#2BA79D]/80 flex items-center"
              onClick={() => setShowAllDestinations(!showAllDestinations)}
            >
              {showAllDestinations ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(isSearching ? searchResults : displayedDestinations).map(
              (destination) => (
                <motion.div
                  key={destination.id}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`destination-card ${
                    selectedCategory &&
                    destination.category
                      .toLowerCase()
                      .includes(selectedCategory.toLowerCase())
                      ? getCategoryColor(selectedCategory)
                      : "bg-white"
                  } rounded-xl shadow-lg overflow-hidden cursor-pointer border`}
                  onClick={() => handleDetailClick(destination)}
                >
                  <div className="relative h-48">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover rounded-t-xl"
                    />
                    <span
                      className={`absolute top-4 right-4 ${
                        selectedCategory &&
                        destination.category
                          .toLowerCase()
                          .includes(selectedCategory.toLowerCase())
                          ? `${getCategoryColor(
                              selectedCategory
                            )} ${getCategoryTextColor(selectedCategory)}`
                          : "bg-white/90 text-[#2BA79D]"
                      } backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold shadow-md border border-white/20`}
                    >
                      {destination.category}
                    </span>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-yellow-400">
                        <FaStar className="w-6 h-6" />
                        <span className="ml-2 text-lg text-gray-600">
                          {destination.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 mb-2">
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
                      {destination.location}
                      {destination.distance && (
                        <span className="ml-2 text-sm text-[#2BA79D]">
                          ({destination.distance.toFixed(1)} km)
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {destination.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">
                        {destination.price}
                      </span>
                      <button className="bg-[#2BA79D] text-white px-6 py-2 rounded-full hover:bg-[#2BA79D]/80 transition-colors">
                        Detail
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-[#231E1B] text-3xl font-bold mb-10 text-center">
            Pertanyaan Umum
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Bagaimana cara memesan tiket?",
                answer:
                  "Anda dapat memesan tiket dengan memilih destinasi yang diinginkan, kemudian mengisi form pemesanan yang tersedia. Setelah itu, lakukan pembayaran sesuai metode yang dipilih.",
              },
              {
                question: "Apa metode pembayaran yang tersedia?",
                answer:
                  "Kami menerima berbagai metode pembayaran termasuk transfer bank, e-wallet, dan kartu kredit. Semua transaksi dilindungi dengan sistem keamanan terbaik.",
              },
              {
                question: "Bagaimana sistem rekomendasi bekerja?",
                answer:
                  "Sistem rekomendasi kami menggunakan algoritma cerdas yang mempertimbangkan preferensi Anda, lokasi, kategori wisata, dan ulasan dari pengguna lain untuk memberikan rekomendasi yang paling sesuai.",
              },
            ].map((faq, index) => (
              <div key={index} className="border rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                >
                  <span className="font-medium text-lg text-[#231E1B]">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openFaqIndex === index ? "rotate-180" : ""
                    }`}
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
                </button>
                <div
                  className={`transition-all duration-200 ease-in-out overflow-hidden ${
                    openFaqIndex === index ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-4 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </main>
  );
}
