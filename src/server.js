const http = require("http");
const url = require("url");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log("Method:", req.method);
    console.log("Path:", pathname);
    console.log("Query:", query);

    res.setHeader("Content-Type", "application/json");

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

    if (req.method === "GET" && pathname === "/api/employees") {
        res.writeHead(200);

        res.end(
            JSON.stringify({
                success: true,
                message: "Employee API",
                query: query
            })
        );

        return;
    }

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