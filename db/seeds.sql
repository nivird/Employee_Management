INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 60000, 1),
('Sales Manager', 80000, 2),
('Marketing Coordinator', 45000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL);
