import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Search, Filter, PackageX } from 'lucide-react';

const CATEGORIES = ['Semua', 'Sayur', 'Buah', 'Bumbu', 'Paket Hemat'];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [readyOnly, setReadyOnly] = useState(false);
  const [sortBy, setSortBy] = useState('-created');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        if (search) {
          query = query.ilike('name', `%${search}%`);
        }
        if (category !== 'Semua') {
          query = query.eq('category', category);
        }
        if (readyOnly) {
          query = query.eq('status', 'ready').gt('stock', 0);
        }

        if (sortBy === '-created') {
          query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'price') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === '-price') {
          query = query.order('price', { ascending: false });
        }

        // Add limit for pagination/performance
        query = query.limit(50);

        const { data, error } = await query;
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, category, readyOnly, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Katalog Produk</h1>
          <p className="text-lg text-gray-600">Temukan sayur, buah, dan bumbu segar pilihan Anda.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <Filter className="w-5 h-5 text-[#5DBB63]" />
                <h2 className="text-xl font-bold text-gray-900">Filter</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pencarian</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-[#5DBB63] focus:border-transparent text-gray-900 transition-all"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
                <div className="flex flex-col gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        category === cat 
                          ? 'bg-gradient-to-r from-[#5DBB63] to-[#4ca052] text-white shadow-md' 
                          : 'bg-transparent text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urutkan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border-transparent rounded-2xl py-3 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-[#5DBB63] focus:border-transparent text-gray-900 transition-all"
                >
                  <option value="-created">Terbaru</option>
                  <option value="price">Harga: Rendah ke Tinggi</option>
                  <option value="-price">Harga: Tinggi ke Rendah</option>
                </select>
              </div>

              {/* Toggles */}
              <div>
                <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">Hanya Ready Stock</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={readyOnly}
                      onChange={(e) => setReadyOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5DBB63]"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageX className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Produk tidak ditemukan</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">Maaf, kami tidak dapat menemukan produk yang sesuai dengan filter pencarian Anda.</p>
                <button 
                  onClick={() => { setSearch(''); setCategory('Semua'); setReadyOnly(false); }}
                  className="bg-[#5DBB63] hover:bg-[#4ca052] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;