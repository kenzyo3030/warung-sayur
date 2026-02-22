import React from 'react';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F8F6F1] text-[#333333] pt-12 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-[#5DBB63] mb-4">Warung Sayur Bu Yogi</h3>
          <p className="text-sm text-gray-600 mb-4">
            Menyediakan sayur segar, buah-buahan, dan bumbu dapur berkualitas setiap hari langsung ke rumah Anda.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Kontak Kami</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> 0821-2564-6353</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Pasar Tradisional, Blok A1</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Ikuti Kami</h4>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-[#5DBB63]"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="text-gray-600 hover:text-[#5DBB63]"><Facebook className="w-6 h-6" /></a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Warung Sayur Bu Yogi. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;