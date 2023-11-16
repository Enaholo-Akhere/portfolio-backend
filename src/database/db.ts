import { Pool } from 'pg';
import config from 'config'


const pool_dev = new Pool({
    user: 'postgres',
    password: config.get<string>('pgpassword'),
    host: 'localhost',
    database: 'my_portfolio',
    port: 5432,
});

const pool_prod = new Pool({
    connectionString: config.get<string>('pg_neon'),
})

const pool = process.env.NODE_ENV === 'production' ? pool_prod : pool_dev;

export default pool;