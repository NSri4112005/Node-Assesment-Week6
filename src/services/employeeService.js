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

module.exports = {
    getEmployees
};