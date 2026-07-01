import { ShoppingBag } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card group">
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} className="product-img" />
        <div className="product-overlay">
          <button 
            className="btn btn-primary add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag size={18} style={{ marginRight: '8px' }} />
            Thêm vào giỏ
          </button>
        </div>
        {product.isNew && <span className="badge-new">Mới</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
