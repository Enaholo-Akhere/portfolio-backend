CREATE DATABASE my_portfolio;

CREATE TABLE user_table (
    no SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    created_on timestamp default CURRENT_TIMESTAMP not null,
    updated_on timestamp default CURRENT_TIMESTAMP not null
);

-- TRIGGER and PROCEDURE functions
CREATE  FUNCTION update_updated_on_user_task()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_user_task_updated_on
    BEFORE UPDATE
    ON
        user_table
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_user_task();