import './About.css';

export default function About() {
  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <div className="about-content">
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80" 
              alt="Giới thiệu về Lumina" 
            />
            <div className="about-badge">
              <span>10+</span>
              <p>Năm Kinh Nghiệm</p>
            </div>
          </div>
          <div className="about-text">
            <h2 className="section-title">Câu Chuyện Của <span>Lumina</span></h2>
            <p className="about-description">
              Tại Lumina, chúng tôi tin rằng vẻ đẹp thực sự bắt nguồn từ sự tự tin và sức khỏe của làn da. 
              Được thành lập từ năm 2014, Lumina luôn tiên phong trong việc tìm kiếm và mang đến những sản phẩm chăm sóc sắc đẹp hoàn toàn từ thiên nhiên, an toàn và hiệu quả nhất.
            </p>
            <p className="about-description">
              Sứ mệnh của chúng tôi là đánh thức vẻ đẹp rạng rỡ tiềm ẩn trong mỗi người phụ nữ, giúp bạn luôn tỏa sáng theo cách riêng của mình. Chúng tôi cam kết không thử nghiệm trên động vật và sử dụng bao bì thân thiện với môi trường.
            </p>
            <ul className="about-features">
              <li>✔️ 100% Nguyên liệu hữu cơ tự nhiên</li>
              <li>✔️ Được chuyên gia da liễu khuyên dùng</li>
              <li>✔️ Cam kết hoàn tiền trong 30 ngày</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
