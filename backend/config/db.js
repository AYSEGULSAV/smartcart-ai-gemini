const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Veritabanı kurulu değilse projenin çökmesini engellemek için timeout süresini kısa tutuyoruz
  connectionTimeoutMillis: 2000 
});

module.exports = pool;