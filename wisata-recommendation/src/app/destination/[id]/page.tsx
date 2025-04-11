"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaPlane,
  FaArrowLeft,
  FaMapMarked,
} from "react-icons/fa";

// Data destinasi (untuk contoh, nanti bisa diambil dari API/database)
const destinations = [
  {
    id: 1,
    name: "Pantai Kuta",
    description: "Pantai eksotis dengan pemandangan sunset yang menakjubkan",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    rating: 4.8,
    ticketPrice: "Rp 25.000",
    location: "Kuta, Badung",
    category: "Wisata Pantai",
    distanceFromCity: "9.5 km dari pusat kota",
    distanceFromAirport: "3.8 km dari Bandara Ngurah Rai",
    openHours: "24 jam",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8",
    ],
  },
  // ... tambahkan data destinasi lainnya
];

const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className="w-6 h-6 text-yellow-400" />
    );
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className="w-6 h-6 text-yellow-400" />
    );
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className="w-6 h-6 text-yellow-400" />
    );
  }

  return <div className="flex">{stars}</div>;
};

export default function DestinationDetail({
  params,
}: {
  params: { id: string };
}) {
  const destination = destinations.find((d) => d.id === parseInt(params.id));
  const [selectedImage, setSelectedImage] = React.useState(0);

  if (!destination) {
    return (
      <div className="min-h-screen bg-[#ECE7E3] pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Destinasi tidak ditemukan
            </h1>
            <Link
              href="/"
              className="text-[#2BA79D] hover:text-[#2BA79D]/80 mt-4 inline-flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/recommendation"
                className="text-lg text-[#231E1B] hover:text-[#2BA79D] transition-colors"
              >
                Rekomendasi
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Detail Content */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-[#2BA79D] hover:text-[#2BA79D]/80 mb-6"
          >
            <FaArrowLeft className="mr-2" /> Kembali
          </Link>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Gallery */}
            <div className="relative h-[500px] bg-gray-100">
              <Image
                src={destination.gallery[selectedImage]}
                alt={destination.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                {destination.gallery.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 
                      ${
                        selectedImage === index
                          ? "border-[#2BA79D]"
                          : "border-transparent"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${destination.name} gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col gap-8">
                {/* Main Info */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-4xl font-bold text-gray-800">
                      {destination.name}
                    </h1>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <RatingStars rating={destination.rating} />
                      </div>
                      <span className="text-lg font-semibold text-gray-800 mt-1">
                        {destination.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                    <span>{destination.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        destination.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#2BA79D] hover:text-[#2BA79D]/80 transition-colors"
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
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Buka di Google Maps
                    </a>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {destination.description}
                  </p>
                </div>

                {/* Detail Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaMapMarked className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Kategori Wisata
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {destination.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaTicketAlt className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Tiket Masuk
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {destination.ticketPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaClock className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Jam Operasional
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {destination.openHours}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaStar className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Popularitas
                        </h3>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={destination.rating} />
                          <span className="text-gray-800 font-medium">
                            ({destination.rating})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaMapMarkerAlt className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Jarak dari Pusat Kota
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {destination.distanceFromCity}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                      <div className="bg-[#2BA79D]/10 p-3 rounded-full mr-4">
                        <FaPlane className="w-6 h-6 text-[#2BA79D]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Jarak dari Bandara
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {destination.distanceFromAirport}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                question: "Apakah tiket bisa di-refund?",
                answer:
                  "Tiket dapat di-refund maksimal 24 jam sebelum waktu kunjungan yang telah dipilih. Biaya refund akan dikenakan sesuai dengan ketentuan yang berlaku.",
              },
            ].map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                  onClick={(e) => {
                    const content = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (content) {
                      if (content.style.maxHeight) {
                        content.style.maxHeight = "";
                      } else {
                        content.style.maxHeight = `${content.scrollHeight}px`;
                      }
                      content.classList.toggle("hidden");
                    }
                  }}
                >
                  <span className="font-medium text-lg text-[#231E1B]">
                    {faq.question}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-500 transform transition-transform duration-200"
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
                  className="hidden transition-all duration-200 ease-in-out"
                  style={{ maxHeight: "0" }}
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
