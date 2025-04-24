"use client";

import React from "react";
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

interface RecommendationResultProps {
  results: Array<{
    id: string;
    name: string;
    location: string;
    category: string;
    rating: number;
    price: number;
    distance?: number;
    image: string;
  }>;
}

export default function RecommendationResult({
  results,
}: RecommendationResultProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Tidak ada hasil rekomendasi yang ditemukan
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="relative h-48">
            <img
              src={result.image}
              alt={result.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#2BA79D] text-white px-3 py-1 rounded-full text-sm">
              {result.category}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#231E1B] mb-2">
              {result.name}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>{result.location}</span>
            </div>
            {result.distance && (
              <div className="text-gray-600 mb-2">
                Jarak: {result.distance.toFixed(1)} km
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="font-medium">{result.rating}</span>
              </div>
              <div className="flex items-center text-[#2BA79D]">
                <FaMoneyBillWave className="mr-1" />
                <span className="font-medium">
                  Rp {result.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
