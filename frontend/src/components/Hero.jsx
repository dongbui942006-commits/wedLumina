import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img 
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1920&q=80" 
          alt="Cosmetic products on a delicate background" 
          className="hero-img"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="container hero-content animate-fade-in">
        <span className="hero-subtitle">Bộ Sưu Tập Mới</span>
        <h1 className="h1 hero-title">Tỏa Sáng Vẻ Đẹp<br/>Chân Thực Của Bạn.</h1>
        <p className="hero-text">
          Khám phá dòng sản phẩm chăm sóc da cao cấp, không thử nghiệm trên động vật, được thiết kế để nuôi dưỡng và nâng tầm vẻ đẹp tự nhiên của bạn.
        </p>
        <div className="hero-actions">
          <a href="#shop" className="btn btn-primary">Mua Sắm Ngay</a>
          <a href="#about" className="btn btn-outline hero-btn-outline">Tìm Hiểu Thêm</a>
        </div>
      </div>
    </section>
  );
}
