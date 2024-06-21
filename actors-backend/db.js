import pg from 'pg';

export const pool = new pg.Pool({
    user: 'postgresactors',
    host: '127.0.0.1',
    database: 'postgresactors_db',
    password: 'S3cret',
    port: 5431,
});
