import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Leaf, Truck, Tag, Star, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1593394070407-ed958cf16cd4?q=80&w=2000" 
            alt="Sayur Segar" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a361d]/90 to-black/40"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="inline-block py-1 px-3 rounded-full bg-[#5DBB63]/20 border border-[#5DBB63]/50 text-[#5DBB63] font-semibold text-sm mb-6 backdrop-blur-sm">
              100% Segar & Alami
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Sayur Segar <br/>
              <span className="text-[#FFA726]">Setiap Hari</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-gray-200 font-light leading-relaxed max-w-xl">
              Pesan sayur, buah, dan bumbu dapur segar dengan mudah. Kami antar langsung ke depan pintu rumah Anda dari Warung Bu Yogi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/produk" 
                className="inline-flex items-center justify-center gap-2 bg-[#FFA726] hover:bg-[#F57C00] text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-[#FFA726]/30"
              >
                Belanja Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F8F6F1] z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kenapa Memilih Kami?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Komitmen kami untuk memberikan pengalaman belanja terbaik untuk keluarga Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 text-[#5DBB63] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Leaf className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Sayur Fresh</h3>
              <p className="text-gray-600 leading-relaxed">Dipilih langsung dari petani lokal setiap pagi untuk menjamin kesegaran maksimal di meja makan Anda.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 text-[#FFA726] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Tag className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Harga Terjangkau</h3>
              <p className="text-gray-600 leading-relaxed">Harga bersahabat seperti belanja langsung di pasar tradisional, tanpa biaya tersembunyi.</p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Truck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Kirim Cepat</h3>
              <p className="text-gray-600 leading-relaxed">Pesan hari ini, langsung diantar ke rumah Anda dengan aman dan tepat waktu tanpa repot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Produk Terbaru</h2>
              <p className="text-gray-500 text-lg">Pilihan segar hari ini untuk keluarga Anda</p>
            </div>
            <Link to="/produk" className="group flex items-center gap-2 text-[#5DBB63] font-bold hover:text-[#4ca052] transition-colors">
              Lihat Semua Katalog <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-[#F8F6F1] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kata Pelanggan Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Kepercayaan Anda adalah motivasi terbesar kami.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ibu Siti", role: "Ibu Rumah Tangga", text: "Sayurnya selalu segar dan harganya murah. Sangat membantu buat ibu rumah tangga yang sibuk." },
              { name: "Mbak Rina", role: "Karyawan Swasta", text: "Pengirimannya cepat banget! Pesan pagi, siang sudah sampai. Kualitas buahnya juga juara." },
              { name: "Bapak Budi", role: "Pengusaha Kuliner", text: "Paket hematnya beneran hemat. Bumbu dapurnya lengkap, nggak perlu repot ke pasar lagi." }
            ].map((testi, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
                <div className="absolute -top-5 right-8 text-6xl text-gray-200 font-serif">"</div>
                <div className="flex text-[#FFA726] mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed relative z-10">"{testi.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5DBB63] to-[#4ca052] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testi.name}</div>
                    <div className="text-sm text-gray-500">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;