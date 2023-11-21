import { Pool } from 'pg';
import config from 'config'
import env from 'dotenv';
import express from 'express';
env.config();


const app = express();

// const pg_password = config.get<string>('pg_password');
// const pg_port = config.get<number>('pg_port');
const pg_neon = process.env.PG_NEON;
console.log('db name', pg_neon, 'ENV', app.get('env'));

const pool_dev = new Pool({
    user: 'postgres',
    password: 'asdf',
    host: 'localhost',
    database: 'my_portfolio',
    port: 5600,
});

const pool_prod = new Pool({
    connectionString: pg_neon,
})

const pool = process.env.NODE_ENV === 'production' ? pool_prod : pool_dev;

export default pool;