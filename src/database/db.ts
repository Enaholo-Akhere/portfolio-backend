import { Pool } from 'pg';
import config from 'config'


const pool_dev = new Pool({
    user: 'postgres',
    password: config.get<string>('pgpassword'),
    host: 'localhost',
    database: 'my_portfolio',
    port: 5432,
})

export default pool_dev;