export const REGISTER_USER = `INSERT INTO user_table (password, email, name, user_id, token, refreshed_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
export const CHECK_EMAIL_EXIST = 'SELECT email FROM user_table WHERE email = $1';
export const LOGIN_USER = "SELECT * FROM user_table WHERE email = $1";
export const REFRESH_TOKEN = "UPDATE user_table SET token = $1, refreshed_token = $2 WHERE user_id = $3 RETURNING *";
export const EDIT_USER = "UPDATE user_table SET name = $1 WHERE user_id = $2 RETURNING *";
export const DELETE_USER_ACCOUNT = "DELETE FROM user_table WHERE user_id = $1 RETURNING *";