const fs = require("fs").promises;
const path = require("path");

const employeesFile = path.join(
    __dirname,
    "../data/employees.json"
);

async function getEmployees() {
    const data = await fs.readFile(employeesFile, "utf-8");

    return JSON.parse(data);
}

async function addEmployee(employee) {
    const employees = await getEmployees();

    employees.push(employee);

    await fs.writeFile(
        employeesFile,
        JSON.stringify(employees, null, 2)
    );

    return employee;
}

// Update Employee
async function updateEmployee(id, updatedData) {
    const employees = await getEmployees();

    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
        return null;
    }

    employees[index] = {
        ...employees[index],
        ...updatedData
    };

    await fs.writeFile(
        employeesFile,
        JSON.stringify(employees, null, 2)
    );

    return employees[index];
}

// Delete Employee
async function deleteEmployee(id) {
    const employees = await getEmployees();

    const index = employees.findIndex((emp) => emp.id === id);

    if (index === -1) {
        return null;
    }

    const deletedEmployee = employees.splice(index, 1)[0];

    await fs.writeFile(
        employeesFile,
        JSON.stringify(employees, null, 2)
    );

    return deletedEmployee;
}

// Search Employees
async function searchEmployees(search) {
    const employees = await getEmployees();

    const searchText = search.toLowerCase();

    return employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchText) ||
        employee.email.toLowerCase().includes(searchText)
    );
}

// Sort Employees
async function sortEmployees(sort) {
    const employees = await getEmployees();

    if (sort === "salary_asc") {
        return employees.sort((a, b) => a.salary - b.salary);
    }

    if (sort === "salary_desc") {
        return employees.sort((a, b) => b.salary - a.salary);
    }

    if (sort === "name_asc") {
        return employees.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    return employees;
}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    sortEmployees
};