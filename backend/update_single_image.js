const { sql, connectDB } = require('./src/db.js');

async function updateImage() {
  try {
    await connectDB();
    const req = new sql.Request();
    
    // Update Item 8
    await req.query(`
      UPDATE Products 
      SET image = 'https://skin1004.com.vn/wp-content/uploads/2020/06/dau-tay-trang-skin1004-1.jpg'
      WHERE name = N'Dầu Tẩy Trang Tự Nhiên'
    `);

    // Update Item 10 to a new generic eye cream image
    await req.query(`
      UPDATE Products 
      SET image = 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80'
      WHERE name = N'Kem Mắt Chống Lão Hóa'
    `);
    
    console.log('Cập nhật ảnh 8 và 10 thành công!');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  }
}

updateImage();

updateImage();
