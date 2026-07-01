let sql;
try {
  sql = require('mssql/msnodesqlv8');
} catch (err) {
  console.warn('Failed to load msnodesqlv8 driver, falling back to mssql. Database connection might fail if relying on Windows Auth.', err.message);
  sql = require('mssql');
}
require('dotenv').config();

const connectionString = 'Driver={ODBC Driver 18 for SQL Server};Server=localhost\\MSSQLSERVER1;Database=master;Trusted_Connection=yes;TrustServerCertificate=yes;';

const dbConfig = {
  connectionString: connectionString
};

let dbConnected = false;

const initialProducts = [
  { name: 'Tinh Chất Dưỡng Sáng Da', category: 'Chăm sóc da', price: 45.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', isNew: 1 },
  { name: 'Kem Dưỡng Ẩm Ban Đêm', category: 'Dưỡng ẩm', price: 38.00, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Son Kem Lì', category: 'Trang điểm', price: 24.00, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Mặt Nạ Đất Sét Làm Sạch', category: 'Đặc trị', price: 32.00, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Nước Hoa Hồng Cân Bằng', category: 'Chăm sóc da', price: 28.00, image: 'https://media.hasaki.vn/wysiwyg/minhchau/nuoc-can-bang-da-cocoon-chiet-xuat-hoa-hong-140ml-2.jpg.jpg', isNew: 0 },
  { name: 'Sữa Rửa Mặt Tạo Bọt', category: 'Làm sạch', price: 22.00, image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80', isNew: 0 },
  { name: 'Kem Chống Nắng SPF 50+', category: 'Bảo vệ', price: 35.00, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80', isNew: 1 },
  { name: 'Dầu Tẩy Trang Tự Nhiên', category: 'Làm sạch', price: 26.00, image: 'https://skin1004.com.vn/wp-content/uploads/2020/06/dau-tay-trang-skin1004-1.jpg', isNew: 0 },
  { name: 'Tinh Dầu Dưỡng Tóc Argan', category: 'Chăm sóc tóc', price: 40.00, image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80', isNew: 1 },
  { name: 'Kem Mắt Chống Lão Hóa', category: 'Đặc trị', price: 42.00, image: 'https://images.unsplash.com/photo-1570194065650-d60fd5dc9a19?auto=format&fit=crop&w=800&q=80', isNew: 0 }
];

async function connectDB() {
  try {
    console.log('Attempting to connect to MSSQL...');
    await sql.connect(dbConfig);
    dbConnected = true;
    console.log('Connected to MSSQL successfully.');

    const request = new sql.Request();

    // Create table if not exists
    await request.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' and xtype='U')
      CREATE TABLE Products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100),
        category NVARCHAR(50),
        price DECIMAL(10,2),
        image NVARCHAR(500),
        isNew BIT
      );
      
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Employees' and xtype='U')
      CREATE TABLE Employees (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        position NVARCHAR(50),
        email NVARCHAR(100),
        phone NVARCHAR(20)
      );
      
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
      CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        isAdmin BIT DEFAULT 0,
        createdAt DATETIME DEFAULT GETDATE()
      );
      
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' and xtype='U')
      CREATE TABLE Orders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        customerName NVARCHAR(100),
        customerEmail NVARCHAR(100),
        customerAddress NVARCHAR(200),
        customerPhone NVARCHAR(20),
        totalAmount DECIMAL(10,2),
        orderDate DATETIME DEFAULT GETDATE()
      );
      
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' and xtype='U')
      CREATE TABLE OrderItems (
        id INT IDENTITY(1,1) PRIMARY KEY,
        orderId INT FOREIGN KEY REFERENCES Orders(id),
        productId INT FOREIGN KEY REFERENCES Products(id),
        quantity INT,
        priceAtTime DECIMAL(10,2)
      );
    `);

    // Insert new products individually if they don't exist
    for (const p of initialProducts) {
      const paramName = p.name.replace(/[^a-zA-Z0-9]/g, '');
      const check = await request.query(`SELECT id FROM Products WHERE name = N'${p.name}'`);
      if (check.recordset.length === 0) {
        request.input(`name_${paramName}`, sql.NVarChar(100), p.name);
        request.input(`cat_${paramName}`, sql.NVarChar(50), p.category);
        request.input(`price_${paramName}`, sql.Decimal(10, 2), p.price);
        request.input(`img_${paramName}`, sql.NVarChar(500), p.image);
        request.input(`new_${paramName}`, sql.Bit, p.isNew);

        await request.query(`
          INSERT INTO Products (name, category, price, image, isNew) 
          VALUES (@name_${paramName}, @cat_${paramName}, @price_${paramName}, @img_${paramName}, @new_${paramName})
        `);
      }
    } console.log('Seeding complete.');
  } catch (err) {
    console.error('Database connection failed. Falling back to in-memory array:', err.message);
  }
}

module.exports = {
  sql,
  connectDB,
  isConnected: () => dbConnected,
  initialProducts
};
