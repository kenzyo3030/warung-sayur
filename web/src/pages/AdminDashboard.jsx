import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AddProductModal from '../components/AddProductModal.jsx';
import EditProductModal from '../components/EditProductModal.jsx';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // ================================
  // FETCH PRODUCTS
  // ================================
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  // ================================
  // FETCH ORDERS
  // ================================
  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            image
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  // ================================
  // UPDATE STATUS (RPC)
  // ================================
  const updateStatus = async (orderId, status) => {
    try {
      const { error } = await supabase.rpc('update_order_status', {
        p_order_id: orderId,
        p_new_status: status
      });

      if (error) throw error;

      showToast('Status berhasil diperbarui');
      fetchOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getPublicUrlSafe = (path) => {
    if (!path) return null;
    const result = supabase.storage.from('product-images').getPublicUrl(path);
    return result?.data?.publicUrl || null;
  };

  const handleDelete = async (id, imagePath) => {
    if (!window.confirm('Yakin hapus produk?')) return;

    try {
      if (imagePath) {
        await supabase.storage.from('product-images').remove([imagePath]);
      }

      await supabase.from('products').delete().eq('id', id);

      showToast('Produk berhasil dihapus');
      fetchProducts();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] py-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          {activeTab === 'products' && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#5DBB63] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambah Produk
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-bold ${
              activeTab === 'products'
                ? 'bg-[#5DBB63] text-white'
                : 'bg-white'
            }`}
          >
            Produk
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-bold ${
              activeTab === 'orders'
                ? 'bg-[#5DBB63] text-white'
                : 'bg-white'
            }`}
          >
            Orders
          </button>
        </div>

        {/* ========================= */}
        {/* PRODUCTS TAB */}
        {/* ========================= */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 text-sm uppercase">
                  <tr>
                    <th className="p-4 text-left">Produk</th>
                    <th className="p-4 text-center">Harga</th>
                    <th className="p-4 text-center">Stok</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              getPublicUrlSafe(product.image) ||
                              'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'
                            }
                            className="w-12 h-12 rounded-lg object-cover"
                            alt={product.name}
                          />
                          <span className="font-medium">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        Rp {product.price?.toLocaleString('id-ID')}
                      </td>

                      <td className="p-4 text-center">
                        {product.stock}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditingProduct(product)}>
                            <Edit2 className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.image)
                            }
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ========================= */}
        {/* ORDERS TAB */}
        {/* ========================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl shadow border"
              >
                <div className="flex justify-between">
                  <div>
                    <p><b>ID:</b> {order.id}</p>
                    <p><b>Customer:</b> {order.customer_name}</p>
                    <p><b>Total:</b> Rp {order.total?.toLocaleString('id-ID')}</p>
                    <p><b>Status:</b> {order.status}</p>
                  </div>

                  <div className="flex gap-2">

                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed')}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, 'completed')}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Completed
                        </button>

                        <button
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Detail
                    </button>

                  </div>
                </div>
              </div>
            ))}

            {selectedOrder && (
              <div className="bg-white p-4 rounded-xl shadow border">
                <h2 className="font-bold mb-3">
                  Detail Order - {selectedOrder.customer_name}
                </h2>

                {selectedOrder.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b py-2"
                  >
                    <span>{item.quantity}x {item.products?.name}</span>
                    <span>
                      Rp {item.price?.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchProducts();
          }}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-[#5DBB63]'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;