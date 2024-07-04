const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project_fff',
  password: 'Niyah3h3',
  port: 5432, // Port default PostgreSQL
});

module.exports = {
    query: (text, params) => pool.query(text, params)

  };

