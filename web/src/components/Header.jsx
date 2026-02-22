import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { ShoppingCart, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[#F8F6F1] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-[#5DBB63] tracking-tight">
          Warung Bu Yogi
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-[#5DBB63] font-semibold transition-colors">Home</Link>
          <Link to="/produk" className="text-gray-700 hover:text-[#5DBB63] font-semibold transition-colors">Produk</Link>
          <Link to="/about" className="text-gray-700 hover:text-[#5DBB63] font-semibold transition-colors">Tentang Kami</Link>
          
          <Link to="/cart" className="relative text-gray-700 hover:text-[#5DBB63] transition-colors p-2">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#FFA726] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {!isAuthenticated ? (
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-[#5DBB63] transition-colors">Admin Login</Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2 text-sm font-bold text-[#5DBB63] hover:text-[#4ca052] transition-colors bg-green-50 px-3 py-1.5 rounded-lg">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-semibold p-2 hover:bg-gray-50 rounded-lg">Home</Link>
          <Link to="/produk" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-semibold p-2 hover:bg-gray-50 rounded-lg">Produk</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-semibold p-2 hover:bg-gray-50 rounded-lg">Tentang Kami</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-800 font-semibold p-2 hover:bg-gray-50 rounded-lg flex items-center gap-2">
            Keranjang <span className="bg-[#FFA726] text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
          </Link>
          
          <div className="h-px bg-gray-100 my-2"></div>
          
          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-500 p-2">Admin Login</Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-[#5DBB63] p-2 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-sm font-medium text-left text-red-500 p-2 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;