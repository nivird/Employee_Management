const inquirer = require('inquirer');
const pool = require('./db/connection');

async function mainMenu() {
  try {
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
        return await viewDepartments();
      case 'View all roles':
        return await viewRoles();
      case 'View all employees':
        return await viewEmployees();
      case 'Add a department':
        return await addDepartment();
      case 'Add a role':
        return await addRole();
      case 'Add an employee':
        return await addEmployee();
      case 'Update an employee role':
        return await updateEmployeeRole();
      case 'Exit':
        await pool.end();
        console.log('Database connection closed.');
        return;
    }
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

async function updateEmployeeRole() {
  try {
    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: 'Enter the employee ID:',
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Enter the new role ID:',
      }
    ]);

    const res = await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2',
      [role_id, employee_id]
    );
    
    console.log(`Updated ${res.rowCount} employee(s)`);
    mainMenu();
  } catch (error) {
    console.error('Error:', error);
    mainMenu();
  }
}

async function addDepartment()
{
  try{
    const { text } = await inquirer.prompt([
      {
        type: 'input',
        name: 'text',
        message: 'Whats your department?',
      }]);
      const res = await pool.query('INSERT INTO department (name) VALUES ($1)',[text]);
      console.table(res.rows);
      mainMenu();
  }catch(error)
  {
    console.error('Error:', error);
    await pool.end();
  } 
};

async function addRole()
{
  try{
    const {title, salary, department_id} = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Whats your title?',
      },
      {
      type: 'input',
      name: 'salary',
      message: 'Whats your salary?',
      },
      {
      type: 'input',
      name: 'department_id',
      message: 'Whats your department_id?',
      }
    ]);
      const res = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',[title, salary, department_id]);
      console.table(res.rows);
      mainMenu();
  }catch(error)
  {
    console.error('Error:', error);
    await pool.end();
  } 
};

async function addEmployee()
{
  try{
    const {first_name, last_name,role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Whats your Firstname?',
      },
      {
      type: 'input',
      name: 'last_name',
      message: 'Whats your Last name?',
      },
      {
      type: 'input',
      name: 'role_id',
      message: 'Whats your role_id?',
      },
      {
        type: 'input',
        name: 'manager_id',
        message: 'Whats your manager_id?',
        }
    ]);
      const res = await pool.query('INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1, $2, $3, $4)',[first_name,last_name,role_id,manager_id]);
      console.table(res.rows);
      mainMenu();
  }catch(error)
  {
    console.error('Error:', error);
    await pool.end();
  } 
};
async function viewDepartments() {
  try {
    const res = await pool.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mainMenu();
  }
}

async function viewRoles() {
  try {
    const res = await pool.query(`
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      JOIN department ON role.department_id = department.id
    `);
    console.table(res.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mainMenu();
  }
}
async function viewEmployees() {
  try {
    const res = await pool.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mainMenu();
  }
}

mainMenu();