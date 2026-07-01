import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import About from './components/About';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.isAdmin) {
      setShowAdmin(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <div className="app-layout">
      <Header 
        cartCount={cart.length} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenLogin={() => setIsLoginOpen(true)}
        user={user}
        onLogout={handleLogout}
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
      />
      
      <main className="main-content">
        {showAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />
            <About />
            <ProductList onAddToCart={handleAddToCart} />
            <Contact />
          </>
        )}
      </main>
      
      <Footer />
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
    </div>
  );
}

export default App;
