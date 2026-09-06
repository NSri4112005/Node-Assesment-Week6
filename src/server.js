
require("dotenv").config();const http = require("http");
const url = require("url");
const employeeService = require("./services/employeeService");
const parseRequestBody = require("./utils/requestBody");
const validateEmployee = require("./utils/validation");
const authService = require("./services/authService");
const authenticateToken = require("./utils/authMiddleware");
const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log("Method:", req.method);
    console.log("Path:", pathname);
    console.log("Query:", query);

    res.setHeader("Content-Type", "application/json");

    // GET /
    if (req.method === "GET" && pathname === "/") {
        res.writeHead(200);

        res.end(
            JSON.stringify({
                success: true,
                message: "Employee Management Server is running"
            })
        );

        return;
    }

    // POST /api/auth/register
    if (req.method === "POST" && pathname === "/api/auth/register") {
        try {
            const body = await parseRequestBody(req);

            if (!body.name || !body.email || !body.password) {
                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Name, email and password are required"
                    })
                );

                return;
            }

            const user = await authService.registerUser(body);

            if (!user) {
                res.writeHead(409);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Email already exists"
                    })
                );

                return;
            }

            res.writeHead(201);

            res.end(
                JSON.stringify({
                    success: true,
                    message: "User registered successfully",
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(500);

            res.end(
                JSON.stringify({
                    success: false,
                    message: "Failed to register user"
                })
            );
        }

        return;
    }

    // POST /api/auth/login
    if (req.method === "POST" && pathname === "/api/auth/login") {
        try {
            const body = await parseRequestBody(req);

            if (!body.email || !body.password) {
                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Email and password are required"
                    })
                );

                return;
            }

            const loginResult = await authService.loginUser(
                body.email,
                body.password
            );

            if (!loginResult) {
                res.writeHead(401);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Invalid email or password"
                    })
                );

                return;
            }

            const user = loginResult.user;
            const token = loginResult.token;

            res.writeHead(200);

            res.end(
                JSON.stringify({
                    success: true,
                    message: "Login successful",
                    token: token,
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(500);

            res.end(
                JSON.stringify({
                    success: false,
                    message: "Failed to login"
                })
            );
        }

        return;
    }

    // POST /api/employees
    if (req.method === "POST" && pathname === "/api/employees") {
        const authResult = authenticateToken(req);

        if (!authResult.success) {
            res.writeHead(401);

            res.end(
                JSON.stringify({
                    success: false,
                    message: authResult.message
                })
            );

            return;
        }
        try {
            const body = await parseRequestBody(req);

            const validationError = validateEmployee(body);

            if (validationError) {
                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: validationError
                    })
                );

                return;
            }

            const employee = await employeeService.addEmployee(body);

            res.writeHead(201);

            res.end(
                JSON.stringify({
                    success: true,
                    message: "Employee added successfully",
                    data: employee
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(400);

            res.end(
                JSON.stringify({
                    success: false,
                    message: error.message
                })
            );
        }

        return;
    }

    // PUT /api/employees/:id
    if (req.method === "PUT" && pathname.startsWith("/api/employees/")) {
        try {
            const id = Number(pathname.split("/")[3]);

            const body = await parseRequestBody(req);

            const validationError = validateEmployee(body);

            if (validationError) {
                res.writeHead(400);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: validationError
                    })
                );

                return;
            }

            const employee = await employeeService.updateEmployee(id, body);

            if (!employee) {
                res.writeHead(404);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Employee not found"
                    })
                );

                return;
            }

            res.writeHead(200);

            res.end(
                JSON.stringify({
                    success: true,
                    message: "Employee updated successfully",
                    data: employee
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(400);

            res.end(
                JSON.stringify({
                    success: false,
                    message: error.message
                })
            );
        }

        return;
    }

    // DELETE /api/employees/:id
    if (req.method === "DELETE" && pathname.startsWith("/api/employees/")) {
        try {
            const id = Number(pathname.split("/")[3]);

            const employee = await employeeService.deleteEmployee(id);

            if (!employee) {
                res.writeHead(404);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Employee not found"
                    })
                );

                return;
            }

            res.writeHead(200);

            res.end(
                JSON.stringify({
                    success: true,
                    message: "Employee deleted successfully",
                    data: employee
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(500);

            res.end(
                JSON.stringify({
                    success: false,
                    message: "Failed to delete employee"
                })
            );
        }

        return;
    }

    // GET /api/employees/:id
    if (req.method === "GET" && pathname.startsWith("/api/employees/")) {
        try {
            const id = Number(pathname.split("/")[3]);

            const employees = await employeeService.getEmployees();

            const employee = employees.find((emp) => emp.id === id);

            if (!employee) {
                res.writeHead(404);

                res.end(
                    JSON.stringify({
                        success: false,
                        message: "Employee not found"
                    })
                );

                return;
            }

            res.writeHead(200);

            res.end(
                JSON.stringify({
                    success: true,
                    data: employee
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(500);

            res.end(
                JSON.stringify({
                    success: false,
                    message: "Failed to get employee"
                })
            );
        }

        return;
    }

    // GET /api/employees
    if (req.method === "GET" && pathname === "/api/employees") {
        const authResult = authenticateToken(req);

        if (!authResult.success) {
            res.writeHead(401);

            res.end(
                JSON.stringify({
                    success: false,
                    message: authResult.message
                })
            );

            return;
        }
        try {
            let employees;

            if (query.search) {
                employees = await employeeService.searchEmployees(query.search);
            } else if (query.sort) {
                employees = await employeeService.sortEmployees(query.sort);
            } else {
                employees = await employeeService.getEmployees();
            }

            res.writeHead(200);

            res.end(
                JSON.stringify({
                    success: true,
                    data: employees
                })
            );
        } catch (error) {
            console.error(error);

            res.writeHead(500);

            res.end(
                JSON.stringify({
                    success: false,
                    message: "Failed to read employee data"
                })
            );
        }

        return;
    }
    // Unknown route
    res.writeHead(404);

    res.end(
        JSON.stringify({
            success: false,
            message: "Route not found"
        })
    );
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});