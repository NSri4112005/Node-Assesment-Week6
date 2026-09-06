function validateEmployee(employee) {
    if (!employee.name) {
        return "Name is required";
    }

    if (!employee.email) {
        return "Email is required";
    }

    if (!employee.department) {
        return "Department is required";
    }

    if (employee.salary === undefined) {
        return "Salary is required";
    }

    return null;
}

module.exports = validateEmployee;