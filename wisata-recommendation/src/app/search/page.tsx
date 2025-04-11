"use client";

import { useState } from "react";
import DestinationCard from "@/components/DestinationCard";

const locations = ["Jakarta", "Bali", "Yogyakarta", "Bandung", "Surabaya"];
const categories = ["Pantai", "Gunung", "Taman", "Museum", "Kuliner"];

export default function SearchPage() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          Cari Destinasi Wisata
        </h2>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Lokasi</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Pilih Lokasi</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
            Cari
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Hasil pencarian akan ditampilkan di sini */}
        </div>
      </div>
    </main>
  );
}
