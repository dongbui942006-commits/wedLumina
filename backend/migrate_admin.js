const { sql, connectDB } = require('./src/db.js');

async function migrateAdmin() {
  try {
    await connectDB();
    const req = new sql.Request();

    // 1. Add isAdmin column if not exists
    console.log('Adding isAdmin column...');
    await req.query(`
      IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'isAdmin'
      )
      BEGIN
        ALTER TABLE Users ADD isAdmin BIT DEFAULT 0;
      END
    `);

    // 2. Add or update admin user
    console.log('Creating/Updating admin user...');
    const check = await req.query(`SELECT id FROM Users WHERE email = 'admin@lumina.vn'`);
    if (check.recordset.length === 0) {
      await req.query(`
        INSERT INTO Users (username, email, password, isAdmin)
        VALUES (N'Quản trị viên', 'admin@lumina.vn', 'admin', 1)
      `);
    } else {
      await req.query(`
        UPDATE Users SET isAdmin = 1 WHERE email = 'admin@lumina.vn'
      `);
    }

    console.log('Admin migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrateAdmin();
