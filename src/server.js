const http = require("http");
const url = require("url");
const employeeService = require("./services/employeeService");

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

    // GET /api/employees
    if (req.method === "GET" && pathname === "/api/employees") {
        try {
            const employees = await employeeService.getEmployees();

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