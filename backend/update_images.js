const { sql, connectDB } = require('./src/db.js');

async function fixImages() {
  await connectDB();
  const req = new sql.Request();
  await req.query(`
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1615397323145-31df7680bbbd?auto=format&fit=crop&w=800&q=80' WHERE name = N'Nước Hoa Hồng Cân Bằng';
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80' WHERE name = N'Sữa Rửa Mặt Tạo Bọt';
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80' WHERE name = N'Kem Chống Nắng SPF 50+';
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1601049541289-9b1b7ceb4478?auto=format&fit=crop&w=800&q=80' WHERE name = N'Dầu Tẩy Trang Tự Nhiên';
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80' WHERE name = N'Tinh Dầu Dưỡng Tóc Argan';
    UPDATE Products SET image = 'https://images.unsplash.com/photo-1570194065650-d60fd5dc9a19?auto=format&fit=crop&w=800&q=80' WHERE name = N'Kem Mắt Chống Lão Hóa';
  `);
  console.log('Images fixed');
  process.exit(0);
}
fixImages();
