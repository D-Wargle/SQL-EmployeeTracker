--check for database and add if not exists
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

-- connect to the database
\c employee_db;

-- create table for employee department
CREATE TABLE department(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- create table for roles
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER REFERENCES department(id)
);

-- create table for employees
CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    manager_id INTEGER REFERENCES employees(id) ON DELETE SET NULL
);