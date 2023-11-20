import { Pool } from 'pg';
import config from 'config'


const pool_dev = new Pool({
    user: 'postgres',
    password: config.get<string>('pg_password'),
    host: 'localhost',
    database: config.get<string>('db_name'),
    port: config.get<number>('pg_port'),
});

const pool_prod = new Pool({
    connectionString: config.get<string>('pg_neon'),
})

const pool = process.env.NODE_ENV === 'production' ? pool_prod : pool_dev;

export default pool;