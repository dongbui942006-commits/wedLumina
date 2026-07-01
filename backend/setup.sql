-- Create the Database (Optional: If you haven't created one yet)
-- CREATE DATABASE LuminaBeauty;
-- GO

-- USE LuminaBeauty;
-- GO

-- Create the Products table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Products' and xtype='U')
BEGIN
    CREATE TABLE Products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        category NVARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image NVARCHAR(500),
        isNew BIT DEFAULT 0
    );
    PRINT 'Table Products created successfully.'
END
ELSE
BEGIN
    PRINT 'Table Products already exists.';
END
GO

-- Insert sample initial products
INSERT INTO Products (name, category, price, image, isNew)
VALUES 
    (N'Tinh Chất Dưỡng Sáng Da', N'Chăm sóc da', 45.00, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', 1),
    (N'Kem Dưỡng Ẩm Ban Đêm', N'Dưỡng ẩm', 38.00, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', 0),
    (N'Son Kem Lì', N'Trang điểm', 24.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', 0),
    (N'Mặt Nạ Đất Sét Làm Sạch', N'Đặc trị', 32.00, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', 0),
    (N'Nước Hoa Hồng Cân Bằng', N'Chăm sóc da', 28.00, 'https://images.unsplash.com/photo-1615397323145-31df7680bbbd?auto=format&fit=crop&w=800&q=80', 0),
    (N'Sữa Rửa Mặt Tạo Bọt', N'Làm sạch', 22.00, 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80', 0),
    (N'Kem Chống Nắng SPF 50+', N'Bảo vệ', 35.00, 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80', 1),
    (N'Dầu Tẩy Trang Tự Nhiên', N'Làm sạch', 26.00, 'https://images.unsplash.com/photo-1601049541289-9b1b7ceb4478?auto=format&fit=crop&w=800&q=80', 0),
    (N'Tinh Dầu Dưỡng Tóc Argan', N'Chăm sóc tóc', 40.00, 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80', 1),
    (N'Kem Mắt Chống Lão Hóa', N'Đặc trị', 42.00, 'https://images.unsplash.com/photo-1570194065650-d60fd5dc9a19?auto=format&fit=crop&w=800&q=80', 0);
GO

-- 2. Tạo bảng Users (Người dùng)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        isAdmin BIT DEFAULT 0,
        createdAt DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table Users created successfully.';
END
GO

-- 3. Tạo bảng Orders (Đơn hàng)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Orders' and xtype='U')
BEGIN
    CREATE TABLE Orders (
        id INT IDENTITY(1,1) PRIMARY KEY,
        customerName NVARCHAR(100),
        customerEmail NVARCHAR(100),
        customerAddress NVARCHAR(200),
        customerPhone NVARCHAR(20),
        totalAmount DECIMAL(10,2),
        orderDate DATETIME DEFAULT GETDATE()
    );
    PRINT 'Table Orders created successfully.';
END
GO

-- 3. Tạo bảng OrderItems (Chi tiết đơn hàng)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrderItems' and xtype='U')
BEGIN
    CREATE TABLE OrderItems (
        id INT IDENTITY(1,1) PRIMARY KEY,
        orderId INT FOREIGN KEY REFERENCES Orders(id),
        productId INT FOREIGN KEY REFERENCES Products(id),
        quantity INT,
        priceAtTime DECIMAL(10,2)
    );
    PRINT 'Table OrderItems created successfully.';
END
GO

-- LỆNH KIỂM TRA DỮ LIỆU ĐÃ BÁN (THÔNG TIN KHÁCH HÀNG & SẢN PHẨM)
USE master;
GO

SELECT 
    O.id AS MaDonHang,
    O.customerName AS TenKhachHang,
    O.customerPhone AS SoDienThoai,
    O.customerAddress AS DiaDiem,
    O.orderDate AS NgayGioDat,
    P.name AS TenSanPham,
    OI.quantity AS SoLuongMua,
    OI.priceAtTime AS GiaBan,
    O.totalAmount AS TongGiaTriDon
FROM Orders O
JOIN OrderItems OI ON O.id = OI.orderId
JOIN Products P ON OI.productId = P.id
ORDER BY O.orderDate DESC;
GO
