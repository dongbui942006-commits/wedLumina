const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sql, connectDB, isConnected, initialProducts } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let productsCache = [...initialProducts]; // Fallback data
let usersCache = []; // Fallback user data
let ordersCache = []; // Fallback order data

// Initialize Database Connection
connectDB();

// API Endpoints
app.get('/api/products', async (req, res) => {
  if (isConnected()) {
    try {
      const request = new sql.Request();
      const result = await request.query('SELECT * FROM Products');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json(productsCache);
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category, price, image, isNew } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  const isNewBit = isNew ? 1 : 0;

  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('name', sql.NVarChar(100), name);
      request.input('category', sql.NVarChar(50), category || 'Uncategorized');
      request.input('price', sql.Decimal(10, 2), price);
      request.input('image', sql.NVarChar(500), image || '');
      request.input('isNew', sql.Bit, isNewBit);

      await request.query(`
        INSERT INTO Products (name, category, price, image, isNew)
        VALUES (@name, @category, @price, @image, @isNew)
      `);
      
      res.status(201).json({ message: 'Product added successfully to database' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const newProduct = {
      id: productsCache.length + 1,
      name,
      category: category || 'Uncategorized',
      price: parseFloat(price),
      image: image || '',
      isNew: isNewBit
    };
    productsCache.push(newProduct);
    res.status(201).json({ message: 'Product added successfully to memory cache', product: newProduct });
  }
});

// Checkout API
app.post('/api/orders', async (req, res) => {
  const { customer, items, total } = req.body;
  
  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  if (isConnected()) {
    try {
      const request = new sql.Request();
      
      // 1. Insert Order
      request.input('customerName', sql.NVarChar(100), customer.name);
      request.input('customerEmail', sql.NVarChar(100), customer.email);
      request.input('customerAddress', sql.NVarChar(200), customer.address);
      request.input('customerPhone', sql.NVarChar(20), customer.phone);
      request.input('totalAmount', sql.Decimal(10, 2), total);
      
      // INSERT and get the generated order id
      const orderResult = await request.query(`
        INSERT INTO Orders (customerName, customerEmail, customerAddress, customerPhone, totalAmount)
        OUTPUT INSERTED.id
        VALUES (@customerName, @customerEmail, @customerAddress, @customerPhone, @totalAmount)
      `);
      
      const orderId = orderResult.recordset[0].id;
      
      // 2. Insert Order Items (For simplicity, a loop. Ideally use a transaction)
      for (const item of items) {
        const itemReq = new sql.Request();
        itemReq.input('orderId', sql.Int, orderId);
        itemReq.input('productId', sql.Int, item.id);
        itemReq.input('quantity', sql.Int, 1); // Assuming quantity is 1 for simple cart
        itemReq.input('priceAtTime', sql.Decimal(10, 2), item.price);
        
        await itemReq.query(`
          INSERT INTO OrderItems (orderId, productId, quantity, priceAtTime)
          VALUES (@orderId, @productId, @quantity, @priceAtTime)
        `);
      }
      
      res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    // Fallback if no DB
    const newOrder = {
      id: ordersCache.length + 1,
      customerName: customer.name,
      customerEmail: customer.email,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      totalAmount: total,
      orderDate: new Date().toISOString(),
      items: items
    };
    ordersCache.push(newOrder);
    res.status(201).json({ message: 'Order mocked successfully', orderId: newOrder.id });
  }
});

// Get Orders
app.get('/api/orders', async (req, res) => {
  if (isConnected()) {
    try {
      const request = new sql.Request();
      const result = await request.query('SELECT * FROM Orders ORDER BY orderDate DESC');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json(ordersCache);
  }
});

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, email, password, isAdmin } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('email', sql.NVarChar(100), email);
      
      // Check if email exists
      const checkResult = await request.query(`SELECT id FROM Users WHERE email = @email`);
      if (checkResult.recordset.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      request.input('username', sql.NVarChar(50), username);
      request.input('password', sql.NVarChar(255), password); // In production, hash this password!
      request.input('isAdmin', sql.Bit, isAdmin ? 1 : 0);
      
      await request.query(`
        INSERT INTO Users (username, email, password, isAdmin)
        VALUES (@username, @email, @password, @isAdmin)
      `);
      
      res.status(201).json({ message: 'User registered successfully', user: { username, email, isAdmin: isAdmin ? 1 : 0 } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    if (usersCache.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const newUser = { id: usersCache.length + 1, username, email, password, isAdmin: isAdmin ? 1 : 0 };
    usersCache.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: { username, email, isAdmin: isAdmin ? 1 : 0 } });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('email', sql.NVarChar(100), email);
      request.input('password', sql.NVarChar(255), password);
      
      const result = await request.query(`SELECT id, username, email, isAdmin FROM Users WHERE email = @email AND password = @password`);
      
      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        res.status(200).json({ message: 'Login successful', user });
      } else {
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  } else {
    // Mock admin credentials fallback
    if (email === 'admin@lumina.vn' && password === 'admin') {
      return res.status(200).json({ message: 'Login successful', user: { id: 0, username: 'Admin', email: 'admin@lumina.vn', isAdmin: 1 } });
    }

    const user = usersCache.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, image, isNew } = req.body;
  const isNewBit = isNew ? 1 : 0;

  try {
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('name', sql.NVarChar(100), name);
    request.input('category', sql.NVarChar(50), category);
    request.input('price', sql.Decimal(10, 2), price);
    request.input('image', sql.NVarChar(500), image);
    request.input('isNew', sql.Bit, isNewBit);

    await request.query(`
      UPDATE Products 
      SET name = @name, category = @category, price = @price, image = @image, isNew = @isNew
      WHERE id = @id
    `);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const request = new sql.Request();
    request.input('id', sql.Int, id);
    
    // First, delete from OrderItems where productId is referenced (if any) to prevent FK errors
    await request.query(`DELETE FROM OrderItems WHERE productId = @id`);
    // Then delete the product
    await request.query(`DELETE FROM Products WHERE id = @id`);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Statistics
app.get('/api/stats', async (req, res) => {
  if (isConnected()) {
    try {
      const request = new sql.Request();
      
      const revenueResult = await request.query('SELECT SUM(totalAmount) as totalRevenue FROM Orders');
      const productsSoldResult = await request.query('SELECT SUM(quantity) as totalProductsSold FROM OrderItems');
      
      res.json({
        totalRevenue: revenueResult.recordset[0].totalRevenue || 0,
        totalProductsSold: productsSoldResult.recordset[0].totalProductsSold || 0
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const totalRevenue = ordersCache.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);
    const totalProductsSold = ordersCache.reduce((sum, order) => {
      const itemsCount = order.items ? order.items.length : 0;
      return sum + itemsCount;
    }, 0);
    res.json({
      totalRevenue,
      totalProductsSold
    });
  }
});

// --- EMPLOYEES API ---
let employeesCache = [];

app.get('/api/employees', async (req, res) => {
  if (isConnected()) {
    try {
      const request = new sql.Request();
      const result = await request.query('SELECT * FROM Employees');
      res.json(result.recordset);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json(employeesCache);
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, position, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('name', sql.NVarChar(100), name);
      request.input('position', sql.NVarChar(50), position || '');
      request.input('email', sql.NVarChar(100), email || '');
      request.input('phone', sql.NVarChar(20), phone || '');

      await request.query(`
        INSERT INTO Employees (name, position, email, phone)
        VALUES (@name, @position, @email, @phone)
      `);
      res.status(201).json({ message: 'Employee added successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    const newEmp = { id: employeesCache.length + 1, name, position, email, phone };
    employeesCache.push(newEmp);
    res.status(201).json({ message: 'Employee added to cache', employee: newEmp });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, email, phone } = req.body;

  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('id', sql.Int, id);
      request.input('name', sql.NVarChar(100), name);
      request.input('position', sql.NVarChar(50), position || '');
      request.input('email', sql.NVarChar(100), email || '');
      request.input('phone', sql.NVarChar(20), phone || '');

      await request.query(`
        UPDATE Employees
        SET name = @name, position = @position, email = @email, phone = @phone
        WHERE id = @id
      `);
      res.json({ message: 'Employee updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json({ message: 'Employee updated in cache' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (isConnected()) {
    try {
      const request = new sql.Request();
      request.input('id', sql.Int, id);
      await request.query(`DELETE FROM Employees WHERE id = @id`);
      res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.json({ message: 'Employee deleted from cache' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
