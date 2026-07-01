import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './CartModal.css';

export default function CartModal({ isOpen, onClose, cart, onRemove, onClearCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customer, setCustomer] = useState({ name: '', email: '', address: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cart,
          total
        })
      });

      if (!response.ok) throw new Error('Checkout failed');

      setSuccessMsg('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
      onClearCart();
    } catch (err) {
      alert('Có lỗi xảy ra khi đặt hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckingOut(false);
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h3 className="h3">{isCheckingOut ? 'Thanh Toán' : 'Giỏ Hàng Của Bạn'}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="cart-body">
          {successMsg ? (
            <div className="success-msg">
              <h3>{successMsg}</h3>
              <button className="btn btn-primary" onClick={handleClose} style={{marginTop: '20px'}}>Đóng</button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input required type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input required type="text" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Địa chỉ giao hàng</label>
                <textarea required rows="3" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}></textarea>
              </div>
            </form>
          ) : cart.length === 0 ? (
            <p className="empty-cart">Giỏ hàng của bạn đang trống.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <button className="remove-btn" onClick={() => onRemove(index)}>
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!successMsg && cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Tổng cộng</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {isCheckingOut ? (
              <button className="btn btn-primary checkout-btn" onClick={handleCheckoutSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận Đặt Hàng'}
              </button>
            ) : (
              <button className="btn btn-primary checkout-btn" onClick={() => setIsCheckingOut(true)}>Tiến hành thanh toán</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
