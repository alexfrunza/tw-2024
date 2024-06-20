const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgresusers',
    host: 'localhost',
    database: 'postgresusers_db',
    password: 'S3cret',
    port: 5433,
});

module.exports = pool;