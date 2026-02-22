import React from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isReady = product.stock > 0 && product.status === 'ready';
  
  const imageUrl = product.image 
    ? supabase.storage.from('product-images').getPublicUrl(product.image).data.publicUrl
    : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isReady ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isReady ? '🟢 Ready' : '🔴 Sold Out'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">{product.category}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <div className="text-xl font-bold text-[#5DBB63] mb-4 mt-auto">
          Rp {product.price.toLocaleString('id-ID')}
        </div>
        
        <button 
          onClick={() => addToCart(product)}
          disabled={!isReady}
          className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
            isReady 
              ? 'bg-[#FFA726] hover:bg-[#F57C00] text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isReady ? 'Tambah ke Keranjang' : 'Habis'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;