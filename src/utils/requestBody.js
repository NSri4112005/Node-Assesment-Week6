function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", (error) => {
            reject(error);
        });
    });
}

module.exports = parseRequestBody;