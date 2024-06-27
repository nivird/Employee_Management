const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'employee_db',
  password: 'password',
  port: 5432,
});

module.exports = pool;
