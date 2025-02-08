INSERT INTO department (name)
VALUES ('Engineering'),
 ('Sales'),
  ('Finance'),
   ('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
 ('Sales Lead', 80000, 2),
  ('Accountant', 75000, 3),
  ('Lawyer', 120000, 4),
    ('Salesperson', 60000, 2),
    ('Finance Manager', 85000, 3),
    ('Legal Team Lead', 125000, 4),
    ('Junior Software Engineer', 80000, 1);

    INSERT INTO employees (firstName, lastName, role_id, manager_id)
    VALUES ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 2, 1),
    ('Alice', 'Smith', 3, 6),
    ('Bob', 'Smith', 4, 7),
    ('Charlie', 'Brown', 5, 2),
    ('David', 'Brown', 6, 2),
    ('Eve', 'Johnson', 7, 4),
    ('Frank', 'Johnson', 8, 4);