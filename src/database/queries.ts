export const REGISTER_USER = `INSERT INTO user_table (password, email, name) VALUES ($1, $2, $3) RETURNING *`
export const CHECK_EMAIL_EXIST = 'SELECT email FROM user_table WHERE email = $1';
export const LOGIN_USER = "SELECT * FROM user_table WHERE email = $1";