DROP DATABASE IF EXISTS Employee_db;
CREATE DATABASE Employee_db;
-- employee database is created

-- Create the 'department' table
CREATE TABLE department (
  id SERIAL PRIMARY KEY, 
  name VARCHAR(30) UNIQUE NOT NULL -- Department name is unique and not null
);

-- Create the 'role' table
CREATE TABLE role (
  id SERIAL PRIMARY KEY, 
  title VARCHAR(30) UNIQUE NOT NULL, -- Role title, must be unique and not null
  salary DECIMAL NOT NULL, 
  department_id INTEGER NOT NULL, -- Foreign key referencing the department table
  FOREIGN KEY (department_id) REFERENCES department(id) 
);

-- Create the 'employee' table
CREATE TABLE employee (
  id SERIAL PRIMARY KEY, -- Primary key
  first_name VARCHAR(30) NOT NULL, -- Employee's first name
  last_name VARCHAR(30) NOT NULL, -- Employee's last name
  role_id INTEGER NOT NULL, -- Foreign key referencing the role table
  manager_id INTEGER, -- Foreign key referencing another employee as the manager, can be null
  FOREIGN KEY (role_id) REFERENCES role(id), -- Establishes the foreign key constraint for role_id
  FOREIGN KEY (manager_id) REFERENCES employee(id) -- Establishes the foreign key constraint for manager_id
);