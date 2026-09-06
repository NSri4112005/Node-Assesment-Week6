require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usersFile = path.join(
    __dirname,
    "../data/users.json"
);

// Get all users
async function getUsers() {
    const data = await fs.readFile(usersFile, "utf-8");

    return JSON.parse(data);
}

// Login user
async function loginUser(email, password) {
    const users = await getUsers();

    const user = users.find(
        (user) => user.email === email
    );

    if (!user) {
        return null;
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        return null;
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        user,
        token
    };
}
// Register user
async function registerUser(user) {
    const users = await getUsers();

    const existingUser = users.find(
        (existingUser) => existingUser.email === user.email
    );

    if (existingUser) {
        return null;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = {
        id: users.length + 1,
        name: user.name,
        email: user.email,
        password: hashedPassword
    };

    users.push(newUser);

    await fs.writeFile(
        usersFile,
        JSON.stringify(users, null, 2)
    );

    return newUser;
}

module.exports = {
    getUsers,
    registerUser,
    loginUser
};