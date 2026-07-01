const { sql, connectDB } = require('./src/db.js');

const newProducts = [
  { name: 'Nước Hoa Hồng Cân Bằng', category: 'Chăm sóc da', price: 28.00, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Sữa Rửa Mặt Tạo Bọt', category: 'Làm sạch', price: 22.00, image: 'https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Kem Chống Nắng SPF 50+', category: 'Bảo vệ', price: 35.00, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=80', isNew: 1 },
  { name: 'Dầu Tẩy Trang Tự Nhiên', category: 'Làm sạch', price: 26.00, image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Tinh Dầu Dưỡng Tóc Argan', category: 'Chăm sóc tóc', price: 40.00, image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80', isNew: 1 },
  { name: 'Kem Mắt Chống Lão Hóa', category: 'Đặc trị', price: 42.00, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80', isNew: 0 }
];

async function addProducts() {
  try {
    await connectDB();
    console.log('Inserting new products...');
    const request = new sql.Request();
    
    for (const p of newProducts) {
      request.input(`name_${p.name.replace(/\s/g, '')}`, sql.NVarChar(100), p.name);
      request.input(`category_${p.name.replace(/\s/g, '')}`, sql.NVarChar(50), p.category);
      request.input(`price_${p.name.replace(/\s/g, '')}`, sql.Decimal(10,2), p.price);
      request.input(`image_${p.name.replace(/\s/g, '')}`, sql.NVarChar(500), p.image);
      request.input(`isNew_${p.name.replace(/\s/g, '')}`, sql.Bit, p.isNew);
      
      // Check if exists
      const check = await request.query(`SELECT id FROM Products WHERE name = @name_${p.name.replace(/\s/g, '')}`);
      if (check.recordset.length === 0) {
        await request.query(`
          INSERT INTO Products (name, category, price, image, isNew) 
          VALUES (@name_${p.name.replace(/\s/g, '')}, @category_${p.name.replace(/\s/g, '')}, @price_${p.name.replace(/\s/g, '')}, @image_${p.name.replace(/\s/g, '')}, @isNew_${p.name.replace(/\s/g, '')})
        `);
      }
    }
    console.log('Done inserting products!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addProducts();
