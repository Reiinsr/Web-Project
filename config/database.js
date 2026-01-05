const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASS || '',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'railway',
  port: process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || 3306
};

let pool = null;

async function initialize() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
  await connection.end();

  pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    charset: 'utf8mb4'
  });

  await ensureTableExists();
  return pool;
}

async function ensureTableExists() {
  const connection = await pool.getConnection();
  const [tables] = await connection.query("SHOW TABLES LIKE 'events'");
  if (tables.length === 0) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) DEFAULT NULL,
        image VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } else {
    const [columns] = await connection.query("SHOW COLUMNS FROM events WHERE Field = 'image'");
    if (columns.length === 0) {
      await connection.query("ALTER TABLE events ADD COLUMN image VARCHAR(255) DEFAULT NULL");
    }
  }
  
  const [messagesTables] = await connection.query("SHOW TABLES LIKE 'messages'");
  if (messagesTables.length === 0) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } else {
    const [columns] = await connection.query("SHOW COLUMNS FROM messages WHERE Field = 'id'");
    if (columns.length > 0 && !columns[0].Extra.includes('auto_increment')) {
      await connection.query("ALTER TABLE messages MODIFY id INT AUTO_INCREMENT");
    }
  }
  
  const [usersTables] = await connection.query("SHOW TABLES LIKE 'users'");
  if (usersTables.length === 0) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  connection.release();
}

function getConnection() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initialize() first.');
  }
  return pool;
}

module.exports = {
  initialize,
  getConnection
};

