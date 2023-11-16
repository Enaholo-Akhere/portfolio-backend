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
    connectionString: `postgresql://Enaholo-Akhere:qO2ZNz5BcLeu@ep-steep-leaf-20820975-pooler.us-east-2.aws.neon.tech/my-portfolio?sslmode=require`
})

const pool = process.env.NODE_ENV === 'production' ? pool_prod : pool_dev;

export default pool;