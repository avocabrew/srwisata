import React from "react";
import { motion } from "framer-motion";
import { FaHiking, FaTree, FaPray, FaPaintBrush } from "react-icons/fa";

const CategoriesSection = ({
  selectedCategory,
  setSelectedCategory,
  handleSearch,
}) => {
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

  return (
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
  );
};

export default CategoriesSection;
