//user queries
export const REGISTER_USER = `INSERT INTO user_table (password, email, name, user_id, token, refreshed_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
export const CHECK_EMAIL_EXIST = 'SELECT email FROM user_table WHERE email = $1';
export const LOGIN_USER = "SELECT * FROM user_table WHERE email = $1";
export const REFRESH_TOKEN = "UPDATE user_table SET token = $1, refreshed_token = $2 WHERE user_id = $3 RETURNING *";
export const EDIT_USER = "UPDATE user_table SET name = $1 WHERE user_id = $2 RETURNING *";
export const DELETE_USER_ACCOUNT = "DELETE FROM user_table WHERE user_id = $1 RETURNING *";
export const GET_ALL_VISITORS = "SELECT name, user_id, email FROM user_table";
export const RESET_PASSWORD = "UPDATE user_table SET password = $1 WHERE email = $2 RETURNING *";


//reset password queries
export const REQUEST_RESET_PASSWORD = 'INSERT INTO user_reset_password (email, reset_token) VALUES ($1, $2) RETURNING *';
export const CHECK_RESET_EMAIL_EXIST = 'SELECT email FROM user_reset_password WHERE email = $1';
export const UPDATE_RESET_PASSWORD = 'UPDATE user_reset_password SET email = $1, reset_token = $2 WHERE email = $1 RETURNING *';
export const DELETE_RESET_PASSWORD = "DELETE FROM user_reset_password WHERE email = $1 RETURNING *"

//send-message
export const SEND_MESSAGE = 'INSERT INTO user_message_me (email, name, message) VALUES ($1, $2, $3) RETURNING *';
export const GET_ALL_MESSAGES = 'SELECT * FROM user_message_me';
export const GET_MESSAGE_VIA_EMAIL = 'SELECT * FROM user_message_me WHERE email = $1'