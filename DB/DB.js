const { Pool } = require('pg');

// Create a new pool instance
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'drive_DB',
  password: '', // Add password if needed
  port: 5432,
});

// Test the connection when the pool is initialized
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error in connection', err);
    return;
  }

  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('Error occurred during query', err);
    } else {
      console.log('Connected to database');
    }
  });
  console.log('connected...');
});

// Export the pool instance for reuse
module.exports = pool;
