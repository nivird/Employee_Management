const inquirer = require('inquirer');
const pool = require('./db/connection');

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ],
    },
  ]);

  switch (action) {
    case 'View all departments':
      return viewDepartments();
    case 'View all roles':
      return viewRoles();
    case 'View all employees':
      return viewEmployees();
    case 'Add a department':
      return addDepartment();
    case 'Add a role':
      return addRole();
    case 'Add an employee':
      return addEmployee();
    case 'Update an employee role':
      return updateEmployeeRole();
    case 'Exit':
      return pool.end();
  }
}

async function viewDepartments() {
  const res = await pool.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
}

async function viewRoles() {
  const res = await pool.query(`
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(res.rows);
  mainMenu();
}

async function viewEmployees() {
  const res = await pool.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  console.table(res.rows);
  mainMenu();
}

async function addDepartment() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Added ${name} to the database.`);
  mainMenu();
}

async function addRole() {
  const departments = await pool.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({ name: department.name, value: department.id }));

  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the name of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department:',
      choices: departmentChoices,
    },
  ]);

  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Added ${title} to the database.`);
  mainMenu();
}

async function addEmployee() {
  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

  const employees = await pool.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
  managerChoices.push({ name: 'None', value: null });

  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role of the employee:',
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager of the employee:',
      choices: managerChoices,
    },
  ]);

  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
  console.log(`Added ${first_name} ${last_name} to the database.`);
  mainMenu();
}

async function updateEmployeeRole() {
  const employees = await pool.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

  const roles = await pool.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role:',
      choices: roleChoices,
    },
  ]);

  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log(`Updated employee's role.`);
  mainMenu();
}

mainMenu();
