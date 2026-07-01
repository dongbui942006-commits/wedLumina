import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="logo">Lumina <span>Sắc Đẹp</span></h2>
          <p className="footer-text">Nâng tầm vẻ đẹp tự nhiên của bạn bằng liệu trình chăm sóc da an toàn và hiệu quả.</p>
          <div className="social-links">
            <a href="#" className="social-link"><Mail size={20} /></a>
            <a href="#" className="social-link"><Phone size={20} /></a>
            <a href="#" className="social-link"><MapPin size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="footer-col">
            <h4 className="footer-col-title">Cửa hàng</h4>
            <ul className="footer-nav">
              <li><a href="#">Chăm sóc da</a></li>
              <li><a href="#">Trang điểm</a></li>
              <li><a href="#">Chăm sóc tóc</a></li>
              <li><a href="#">Hàng mới về</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-col-title">Về Chúng Tôi</h4>
            <ul className="footer-nav">
              <li><a href="#">Câu chuyện</a></li>
              <li><a href="#">Thành phần</a></li>
              <li><a href="#">Bền vững</a></li>
              <li><a href="#">Tuyển dụng</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4 className="footer-col-title">Trợ Giúp</h4>
            <ul className="footer-nav">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Vận chuyển</a></li>
              <li><a href="#">Đổi trả</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lumina Sắc Đẹp. Đã đăng ký bản quyền.</p>
      </div>
    </footer>
  );
}
