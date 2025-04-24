"use client";

import React, { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

interface RecommendationFormProps {
  onSubmit: (formData: RecommendationFormData) => void;
}

export interface RecommendationFormData {
  location: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  considerDistance: boolean;
}

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

export default function RecommendationForm({
  onSubmit,
}: RecommendationFormProps) {
  const [formData, setFormData] = useState<RecommendationFormData>({
    location: "",
    category: "",
    priceRange: { min: 0, max: 1000000 },
    considerDistance: false,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setFormData((prev) => ({ ...prev, considerDistance: true }));
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[#231E1B] font-medium mb-2">
            Lokasi
          </label>
          <div className="relative">
            <select
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full p-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent appearance-none bg-transparent"
            >
              <option value="">Pilih lokasi yang ingin dikunjungi</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#231E1B] font-medium mb-2">
            Kategori
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-3 border border-gray-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2BA79D] focus:border-transparent appearance-none bg-transparent"
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
              value={formData.priceRange.min}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceRange: {
                    ...prev.priceRange,
                    min: Number(e.target.value),
                  },
                }))
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
              value={formData.priceRange.max}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priceRange: {
                    ...prev.priceRange,
                    max: Number(e.target.value),
                  },
                }))
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
            type="button"
            onClick={handleGetLocation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              formData.considerDistance
                ? "bg-[#2BA79D] text-white"
                : "bg-gray-100 text-gray-600"
            } hover:bg-[#2BA79D] hover:text-white transition-colors`}
            disabled={isLoadingLocation}
          >
            <FaLocationArrow
              className={`w-4 h-4 ${isLoadingLocation ? "animate-spin" : ""}`}
            />
            <span>
              {isLoadingLocation ? "Mencari Lokasi..." : "Pertimbangkan Jarak"}
            </span>
          </button>
          {formData.considerDistance && (
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, considerDistance: false }))
              }
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
        type="submit"
        className="w-full bg-[#2BA79D] text-white px-8 py-3 rounded-full hover:bg-[#2BA79D]/80 transition-colors text-lg font-medium"
      >
        Dapatkan Rekomendasi
      </button>
    </form>
  );
}
