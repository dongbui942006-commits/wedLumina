import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from the backend API
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setError('Could not load products.');
        setLoading(false);
      });
  }, []);

  return (
    <section id="shop" className="product-section">
      <div className="container">
        <div className="section-header">
          <h2 className="h2 section-title">Sản Phẩm Nổi Bật</h2>
          <p className="section-subtitle">Công thức tinh tuyển cho quy trình chăm sóc hàng ngày của bạn.</p>
        </div>
        
        {loading && <p style={{textAlign: 'center'}}>Đang tải sản phẩm...</p>}
        {error && <p style={{textAlign: 'center', color: 'red'}}>Không thể tải sản phẩm.</p>}
        
        {!loading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

