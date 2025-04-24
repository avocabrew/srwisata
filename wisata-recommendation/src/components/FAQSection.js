import React from "react";

const FAQSection = () => {
  const [openFaqIndex, setOpenFaqIndex] = React.useState(null);

  const faqs = [
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
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-[#231E1B] text-3xl font-bold mb-10 text-center">
          Pertanyaan Umum
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
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
  );
};

export default FAQSection;
