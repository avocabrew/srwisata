import "./globals.css";

export const metadata = {
  title: "TripMatch - Sistem Rekomendasi Wisata",
  description: "Sistem rekomendasi destinasi wisata Kabupaten Badung",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
