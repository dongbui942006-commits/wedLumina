import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <h2 className="section-title text-center">Liên Hệ <span>Với Chúng Tôi</span></h2>
        <p className="section-subtitle text-center">Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7</p>

        <div className="contact-container">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon"><MapPin size={28} /></div>
              <h3>Địa chỉ cửa hàng</h3>
              <p>123 Đường Sắc Đẹp, Quận 1<br/>Thành phố Hồ Chí Minh</p>
            </div>
            <div className="info-card">
              <div className="info-icon"><Phone size={28} /></div>
              <h3>Số điện thoại</h3>
              <p>Hotline: 1900 1234<br/>Hỗ trợ: 0987 654 321</p>
            </div>
            <div className="info-card">
              <div className="info-icon"><Mail size={28} /></div>
              <h3>Email liên hệ</h3>
              <p>cskh@lumina.vn<br/>doitac@lumina.vn</p>
            </div>
            <div className="info-card">
              <div className="info-icon"><Clock size={28} /></div>
              <h3>Giờ mở cửa</h3>
              <p>Thứ 2 - Thứ 6: 8:00 - 21:00<br/>Thứ 7 - CN: 9:00 - 22:00</p>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.'); }}>
              <h3>Gửi Lời Nhắn</h3>
              <div className="form-group">
                <input type="text" placeholder="Họ và tên của bạn" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <input type="email" placeholder="Địa chỉ Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Số điện thoại" required />
                </div>
              </div>
              <div className="form-group">
                <textarea rows="5" placeholder="Bạn cần hỗ trợ vấn đề gì?" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary contact-submit-btn">Gửi Tin Nhắn</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
