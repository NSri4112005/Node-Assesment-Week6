const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;

    res.setHeader("Content-Type", "application/json");

    if (method === "GET" && url === "/") {
        res.writeHead(200);

        res.end(
            JSON.stringify({
                success: true,
                message: "Employee Management Server is running"
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