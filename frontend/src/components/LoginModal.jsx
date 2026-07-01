import { X } from 'lucide-react';
import { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', isAdmin: false });
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const endpoint = isLoginTab ? '/api/login' : '/api/register';
    const bodyData = isLoginTab 
      ? { email: formData.email, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password, isAdmin: formData.isAdmin };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      // Success
      if (isLoginTab) {
        onLoginSuccess(data.user);
      } else {
        // Auto login after register
        onLoginSuccess(data.user);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (isLogin) => {
    setIsLoginTab(isLogin);
    setErrorMsg('');
    setFormData({ username: '', email: '', password: '', isAdmin: false });
  };

  return (
    <div className="cart-overlay">
      <div className="login-modal">
        <button className="close-btn login-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="login-tabs">
          <button className={`tab-btn ${isLoginTab ? 'active' : ''}`} onClick={() => switchTab(true)}>Đăng Nhập</button>
          <button className={`tab-btn ${!isLoginTab ? 'active' : ''}`} onClick={() => switchTab(false)}>Đăng Ký</button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && <div className="error-msg">{errorMsg}</div>}

          {!isLoginTab && (
            <>
              <div className="form-group">
                <label>Họ và tên</label>
                <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="form-checkbox" style={{ marginBottom: '15px' }}>
                <input type="checkbox" id="isAdmin" checked={formData.isAdmin} onChange={e => setFormData({...formData, isAdmin: e.target.checked})} />
                <label htmlFor="isAdmin">Đăng ký tài khoản Quản Trị Viên</label>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : (isLoginTab ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
          </button>
        </form>
      </div>
    </div>
  );
}
