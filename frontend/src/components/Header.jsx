import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ cartCount, onOpenCart, onOpenLogin, user, onLogout, showAdmin, setShowAdmin }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    setIsMobileMenuOpen(false);
    if (setShowAdmin) setShowAdmin(false);
    
    if (targetId) {
      e.preventDefault();
      // Delay scrolling to allow React to mount the storefront components
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // For 'Trang chủ' (home)
      e.preventDefault();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'glass' : ''}`}>
      <div className="container header-container">
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo" onClick={(e) => handleNavClick(e, null)}>
          Lumina <span>Sắc Đẹp</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
          <a href="#" className="nav-link" onClick={(e) => handleNavClick(e, null)}>Trang chủ</a>
          <a href="#shop" className="nav-link" onClick={(e) => handleNavClick(e, 'shop')}>Cửa hàng</a>
          <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>Giới thiệu</a>
          <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, 'contact')}>Liên hệ</a>
          {user && user.isAdmin && (
            <a href="#" className="nav-link admin-nav-link" style={{color: 'var(--color-primary)', fontWeight: 'bold'}} onClick={() => { setIsMobileMenuOpen(false); setShowAdmin(!showAdmin); }}>
              {showAdmin ? 'Về Cửa Hàng' : 'Quản Trị Viên'}
            </a>
          )}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {user ? (
            <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Chào, {user.username}</span>
              <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', textDecoration: 'underline' }}>Đăng xuất</button>
            </div>
          ) : (
            <button className="icon-btn" onClick={onOpenLogin} title="Đăng nhập">
              <User size={24} />
            </button>
          )}

          <button className="cart-btn" onClick={onOpenCart}>
            <ShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
