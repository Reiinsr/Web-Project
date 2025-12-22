const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'event_management',
  port: process.env.DB_PORT || 3306
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
  console.log('Database initialized successfully');
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Events table created');
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

