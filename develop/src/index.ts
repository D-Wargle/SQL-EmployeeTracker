import express from 'express';
import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './Connection.js';
import dotenv from 'dotenv';
import Table from 'cli-table3';

dotenv.config();
//set port

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Start inquirer prompts
const startInquirer = async () => {
    try {
        await connectToDb();
        inquirer.prompt([
            { 
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add department',
                    'Add employee',
                    'Add role',
                    'Update employee role',
                    'Quit'
                ]
            },
        ])
        .then(answers => {
            switch (answers.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    process.exit(0);
                    break;
            }
        });
    } catch (error) {
        console.error('Error starting inquirer', error);
        process.exit(1);
    }
};

// create a formatted table for the employee results

const viewEmployees = async () => {
    try {
        const result: QueryResult = await pool.query('SELECT employees.id AS "ID", employees.firstName AS "First Name", employees.lastName AS "Last Name", roles.title AS "Job Title", department.name AS "Department", roles.salary AS "Salary", CONCAT(managers.firstName, \' \', managers.lastName) AS "Manager" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees managers ON employees.manager_id = managers.id');
        const table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Job Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 10, 15]
        });
        result.rows.forEach((row) => {
            table.push([row['ID'], row['First Name'], row['Last Name'], row['Job Title'], row['Department'], row['Salary'], row['Manager']]);
        });
        console.log(table.toString());
    } catch (error) {
        console.error('Error viewing employees', error);
    } finally {
        startInquirer();
    }
};

const viewDepartments = async () => {
    try {
        const result: QueryResult = await pool.query('SELECT id AS "ID", name AS "Department Name" FROM department');
        const table = new Table({
            head: ['ID', 'Department Name'],
            colWidths: [5, 15]
        });
        result.rows.forEach((row) => {
            //possible bug here
            table.push([row['id'], row['Department Name']]);
        });
        console.log(table.toString());
    } catch (error) {
        console.error('Error viewing departments', error);
    } finally {
        startInquirer();
    }
};

const viewRoles = async () => {
    try {
        const roles: QueryResult = await pool.query('SELECT roles.id AS "ID", roles.title AS "Job Title", roles.salary AS "Salary", department.name AS "Department" FROM roles LEFT JOIN department ON roles.department_id = department.id');
        const table = new Table({
            head: ['ID', 'Job Title', 'Salary', 'Department'],
            colWidths: [5, 15, 10, 15]
        });
        roles.rows.forEach((row) => {
            // possible bug here
            table.push([row['ID'], row['Job Title'], row['Salary'], row['Department']]);
        });
        console.log(table.toString());
    } catch (error) {
        console.error('Error viewing roles', error);
    } finally {
        startInquirer();
    }
};

const addDepartment = async () => {
    try {
        const departmentCreate = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department'
            }
        ]);
        await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentCreate.name]);
        console.log('Department added successfully');
    } catch (error) {
        console.error('Error adding department', error);
    } finally {
        startInquirer();
    }
};

const addRole = async () => {
    try {
        const departments = await pool.query('SELECT * FROM department');

        const roleCreate = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the Job Title',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select the department',
                // possible bug here

                choices: departments.rows.map((department) => ({
                    name: department.name,
                    value: department.id
                })),
            },
        ]);
        await pool.query(
            'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
            [roleCreate.title,
            roleCreate.salary,
            roleCreate.department
            ]
        );

        console.log('Role added successfully');
    } catch (error) {
        console.error('Error adding role', error);
    } finally {
        startInquirer();
    }
};

const addEmployee = async () => {
    try {
       const employees = await pool.query('SELECT * FROM employees');
         const roles = await pool.query('SELECT * FROM roles');

         const employeeCreate = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the first name of the employee',
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the last name of the employee',
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Select the role',
                    choices: roles.rows.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Select the manager',
                    choices: employees.rows.map((employee) => ({
                        name: `${employee.firstName} ${employee.lastName}`,
                        value: employee.id,
                    })),
                },
            ]); 

            await pool.query(
                'INSERT INTO employees (firstName, lastName, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                [employeeCreate.firstName,
                employeeCreate.lastName,
                employeeCreate.role,
                employeeCreate.manager
                ]
            );
            console.log('Employee added successfully');
    } catch (error) {
        console.error('Error adding employee', error);
    } finally {
        startInquirer();
    }
};

const updateEmployeeRole = async () => {
    try {
        const employees = await pool.query('SELECT * FROM employees');
        const roles = await pool.query('SELECT * FROM roles');

        const employeeUpdate = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee',
                choices: employees.rows.map((employee) => ({
                    name: `${employee.firstName} ${employee.lastName}`,
                    value: employee.id,
                })),
            },
            {
                type: 'list',
                name: 'role',
                message: 'Select the role',
                choices: roles.rows.map((role) => ({
                    name: role.title,
                    value: role.id,
                })),
            },
        ]);

        await pool.query(
            'UPDATE employees SET role_id = $1 WHERE id = $2',
            [employeeUpdate.role, employeeUpdate.employee]
        );

        console.log('Employee role updated successfully');
    } catch (error) {
        console.error('Error updating employee role', error);
    } finally {
        startInquirer();
    }
};

app.use((_res, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

startInquirer();
