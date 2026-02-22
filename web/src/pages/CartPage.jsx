import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    hp: '',
    catatan: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // VALIDASI PRODUCT ID
      // ==============================
      const itemsForDB = cartItems.map(item => {
        const productId = item.productId || item.id;

        if (!productId) {
          throw new Error(`Product ID tidak ditemukan untuk produk: ${item.name}`);
        }

        return {
          product_id: productId,
          quantity: item.quantity,
          price: item.price
        };
      });

      // ==============================
      // PANGGIL RPC TRANSACTION
      // ==============================
      const { data: orderId, error } = await supabase.rpc(
        "create_order_transaction",
        {
          p_customer_name: formData.nama,
          p_phone: formData.hp,
          p_address: formData.alamat,
          p_total: getCartTotal(),
          p_items: itemsForDB
        }
      );

      if (error) throw error;

      // ==============================
      // BUAT PESAN WHATSAPP
      // ==============================
      let message = `*PESANAN BARU - WARUNG BU YOGI*\n\n`;
      message += `Order ID: ${orderId}\n\n`;
      message += `*Data Pemesan:*\n`;
      message += `Nama: ${formData.nama}\n`;
      message += `No HP: ${formData.hp}\n`;
      message += `Alamat: ${formData.alamat}\n`;
      if (formData.catatan) message += `Catatan: ${formData.catatan}\n`;

      message += `\n*Daftar Pesanan:*\n`;
      cartItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
      });

      message += `\n*Total Belanja: Rp ${getCartTotal().toLocaleString('id-ID')}*`;

      const encodedMessage = encodeURIComponent(message);

      // ==============================
      // CLEAR CART
      // ==============================
      cartItems.forEach(item => {
        const productId = item.productId || item.id;
        removeFromCart(productId);
      });

      // ==============================
      // REDIRECT WHATSAPP
      // ==============================
      window.open(
        `https://wa.me/6282125646353?text=${encodedMessage}`,
        "_blank"
      );

    } catch (err) {
      console.error(err);
      alert("Checkout gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8F6F1] px-4">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Keranjang Masih Kosong</h2>
        <p className="text-lg text-gray-500 mb-10 text-center max-w-md">
          Sepertinya Anda belum menambahkan produk apapun.
        </p>
        <Link 
          to="/produk" 
          className="bg-gradient-to-r from-[#FFA726] to-[#F57C00] text-white font-bold py-4 px-10 rounded-full flex items-center gap-2"
        >
          Mulai Belanja <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10">
          Keranjang Belanja
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* CART ITEMS */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="p-6 md:p-8 space-y-8">
                {cartItems.map(item => {
                  const productId = item.productId || item.id;

                  return (
                    <div key={productId} className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b last:border-0">
                      <div className="flex-grow text-center sm:text-left w-full">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.name}
                        </h3>
                        <div className="text-[#5DBB63] font-semibold text-lg">
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button onClick={() => updateQuantity(productId, item.quantity - 1)}>
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="font-bold">{item.quantity}</span>

                        <button onClick={() => updateQuantity(productId, item.quantity + 1)}>
                          <Plus className="w-4 h-4" />
                        </button>

                        <button onClick={() => removeFromCart(productId)}>
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CHECKOUT FORM */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Ringkasan Pesanan</h2>

              <div className="flex justify-between mb-8">
                <span>Total</span>
                <span className="font-bold text-xl text-[#5DBB63]">
                  Rp {getCartTotal().toLocaleString('id-ID')}
                </span>
              </div>

              <form onSubmit={handleCheckout} className="space-y-5">

                <input
                  type="text"
                  name="nama"
                  required
                  placeholder="Nama Lengkap"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl"
                />

                <input
                  type="tel"
                  name="hp"
                  required
                  placeholder="No WhatsApp"
                  value={formData.hp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl"
                />

                <textarea
                  name="alamat"
                  required
                  placeholder="Alamat Lengkap"
                  rows="3"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl"
                />

                <input
                  type="text"
                  name="catatan"
                  placeholder="Catatan (opsional)"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FFA726] to-[#F57C00] text-white font-bold py-4 rounded-xl disabled:opacity-50"
                >
                  {loading ? "Memproses..." : "Checkout via WhatsApp"}
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;