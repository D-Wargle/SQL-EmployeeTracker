--Check for existing database and erase, then create new database
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
    roleID INTEGER REFERENCES roles(id),
    managerID INTEGER REFERENCES employees(id)
);