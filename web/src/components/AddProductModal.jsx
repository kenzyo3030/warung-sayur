import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { X, Upload } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner.jsx';

const AddProductModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sayur',
    stock: '',
    status: 'ready'
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setImageFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imagePath = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        imagePath = uploadData.path;
      }

      const { error: insertError } = await supabase.from('products').insert([{
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock, 10),
        status: formData.status,
        image: imagePath
      }]);

      if (insertError) throw insertError;

      onSuccess('Produk berhasil ditambahkan!');
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.message || 'Terjadi kesalahan saat menambahkan produk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900">
                  <option value="Sayur">Sayur</option>
                  <option value="Buah">Buah</option>
                  <option value="Bumbu">Bumbu</option>
                  <option value="Paket Hemat">Paket Hemat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
                  <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select name="status" required value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900">
                    <option value="ready">Ready</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-[#5DBB63] focus:border-[#5DBB63] text-gray-900"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Produk</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#5DBB63] transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#5DBB63] hover:text-[#4ca052] focus-within:outline-none">
                        <span>Upload file</span>
                        <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="sr-only" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                    {imageFile && <p className="text-sm text-green-600 font-medium mt-2">Terpilih: {imageFile.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#5DBB63] text-white rounded-xl font-medium hover:bg-[#4ca052] transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading && <LoadingSpinner size="small" />}
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;