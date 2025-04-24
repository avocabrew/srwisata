"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import CategoriesSection from "../components/CategoriesSection";
import DestinationCard from "../components/DestinationCard";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();
  const [showAllDestinations, setShowAllDestinations] = React.useState(false);
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [destinations, setDestinations] = React.useState([]);
  const [userLocation, setUserLocation] = React.useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);

  const handleDetailClick = (destination) => {
    router.push(`/destination/${destination.id}`);
  };

  const handleSearch = () => {
    setIsSearching(true);
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

    const destinationSection = document.getElementById("search-results");
    if (destinationSection) {
      destinationSection.scrollIntoView({ behavior: "smooth" });
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

  const findNearestDestinations = async (userLat, userLng) => {
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

      const destinationsWithDistance = data.results.bindings
        .map((item) => {
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
        .sort((a, b) => a.distance - b.distance);

      setSearchResults(destinationsWithDistance);
      setIsSearching(true);
    } catch (error) {
      console.error("Error fetching nearest destinations:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

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

        const transformedDestinations = data.results.bindings.map(
          (item, index) => ({
            id: index + 1,
            name: item.namaTempat.value,
            description: "Deskripsi akan ditambahkan",
            image:
              "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1000&auto=format&fit=crop",
            rating: parseFloat(item.rating.value),
            location: item.lokasi.value,
            category: item.kategori.value,
            price: "Hubungi untuk info",
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
      <Navbar />
      <SearchSection
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSearch={handleSearch}
        getUserLocation={getUserLocation}
        isLoadingLocation={isLoadingLocation}
      />
      <CategoriesSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSearch={handleSearch}
      />
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
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  selectedCategory={selectedCategory}
                  handleDetailClick={handleDetailClick}
                />
              )
            )}
          </div>
        </div>
      </section>
      <FAQSection />
      <Footer />
    </main>
  );
}
