import { calculateSAW } from "../utils/sawCalculator";

// Dalam komponen React
const handleSubmit = (formData) => {
  // Siapkan kriteria berdasarkan input form
  const criteria = [
    { name: "rating", weight: 0.4, type: "benefit" },
    { name: "price", weight: 0.3, type: "cost" },
    { name: "distance", weight: 0.3, type: "cost" },
  ];

  // Siapkan data alternatif dari database/API
  const alternatives = [
    // ... data tempat wisata
  ];

  // Hitung rekomendasi menggunakan SAW
  const recommendations = calculateSAW(alternatives, criteria);

  // Tampilkan hasil
  setResults(recommendations);
};
