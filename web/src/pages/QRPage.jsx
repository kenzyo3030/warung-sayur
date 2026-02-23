import React from "react";
import QRCodeSection from "../components/QRCodeSection";

const QRPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#5DBB63]">
        Scan untuk Kunjungi Website
      </h1>

      <QRCodeSection />
    </div>
  );
};

export default QRPage;