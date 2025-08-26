import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cinema_db',
    password: '1234',
    port: 5432,
});

export const query = (text, params) => pool.query(text, params);
