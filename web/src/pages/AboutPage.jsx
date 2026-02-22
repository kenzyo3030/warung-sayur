import React from 'react';
import { Heart, Users, Sprout, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#5DBB63]/20 via-[#F8F6F1] to-[#FFA726]/10">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Tentang <span className="text-[#5DBB63]">Warung Bu Yogi</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Menghadirkan kesegaran alam langsung ke meja makan Anda. Kami percaya bahwa makanan sehat berawal dari bahan baku yang berkualitas.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000" 
                alt="Sayuran Segar" 
                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Cerita Kami</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Berawal dari sebuah lapak kecil di pasar tradisional, Warung Bu Yogi telah melayani pelanggan setia selama lebih dari 10 tahun. Dedikasi kami terhadap kualitas dan pelayanan yang ramah membuat kami terus berkembang.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Kini, kami bertransformasi secara digital untuk memudahkan Anda berbelanja kebutuhan dapur tanpa harus keluar rumah. Meski cara berbelanja berubah, komitmen kami terhadap kesegaran dan harga yang jujur tetap sama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Prinsip yang kami pegang teguh dalam melayani setiap pelanggan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Sprout, title: "Kesegaran Terjamin", desc: "Sayur dan buah dipilih langsung dari petani lokal setiap pagi.", color: "text-green-500", bg: "bg-green-50" },
              { icon: Heart, title: "Pelayanan Sepenuh Hati", desc: "Kami melayani Anda layaknya keluarga sendiri.", color: "text-red-500", bg: "bg-red-50" },
              { icon: ShieldCheck, title: "Kualitas Terbaik", desc: "Melewati proses sortir ketat sebelum dikirim ke rumah Anda.", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Users, title: "Pemberdayaan Lokal", desc: "Mendukung kesejahteraan petani dan pemasok lokal.", color: "text-orange-500", bg: "bg-orange-50" }
            ].map((val, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <val.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;