import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const DestinationCard = ({
  destination,
  selectedCategory,
  handleDetailClick,
}) => {
  const getCategoryColor = (category) => {
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

  const getCategoryTextColor = (category) => {
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

  return (
    <motion.div
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
              ? `${getCategoryColor(selectedCategory)} ${getCategoryTextColor(
                  selectedCategory
                )}`
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
        <p className="text-gray-600 mb-4">{destination.description}</p>
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
  );
};

export default DestinationCard;
