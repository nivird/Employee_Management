-- Insert departments
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Finance');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 90000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 70000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bill', 'Gates', 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Brown', 2, 2);
