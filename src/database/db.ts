import { Pool } from 'pg';
import config from 'config'


// const db_name = config.get<string>('db_name');
const pg_password = config.get<string>('pg_password');
const pg_port = config.get<number>('pg_port');

console.log('db name', pg_password, pg_port);

const pool_dev = new Pool({
    user: 'postgres',
    password: pg_password,
    host: 'localhost',
    database: 'my_portfolio',
    port: pg_port,
});

const pool_prod = new Pool({
    connectionString: config.get<string>('pg_neon'),
})

const pool = process.env.NODE_ENV === 'production' ? pool_prod : pool_dev;

export default pool;