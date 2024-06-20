import pg from 'pg';

export const pool = new pg.Pool({
    user: 'postgresusers',
    host: 'localhost',
    database: 'postgresusers_db',
    password: 'S3cret',
    port: 5433,
});
