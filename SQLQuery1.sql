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
    PRINT 'Table Products created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Products already exists.';
END
GO


-- Verify the inserted data
SELECT * FROM Products;
GO
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


-- 2. Tạo bảng Orders (Đơn hàng)
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

-- LỆNH KIỂM TRA DỮ LIỆU
-- Xem danh sách sản phẩm:
SELECT * FROM Products;

-- Xem danh sách Đơn Hàng (Bao gồm Địa điểm, Ngày Giờ, Tên SP, Số lượng):
SELECT 
    O.id AS MaDonHang,
    O.customerName AS TenKhachHang,
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
-- Verify the inserted data
SELECT * FROM Products;
GO
