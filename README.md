# Employee Management Server

A Node.js backend application for managing employee records using the built-in HTTP module.

## Technologies Used

- Node.js
- JavaScript
- HTTP
- File System (fs)
- Path
- URL
- JSON
- bcryptjs
- JSON Web Token (JWT)
- dotenv

## Features

- Employee CRUD operations
- JSON file-based data storage
- User registration
- User login
- Password hashing using bcryptjs
- JWT authentication
- Protected employee APIs
- Employee search
- Department filtering
- Employee sorting
- Input validation
- HTTP status codes
- Environment variable configuration

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login

### Employees

- GET /api/employees
- GET /api/employees/:id
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id

## Query Parameters

### Search

GET /api/employees?search=rahul

### Department Filter

GET /api/employees?department=Development

### Sort by Salary

GET /api/employees?sort=salary_asc

GET /api/employees?sort=salary_desc

### Sort by Name

GET /api/employees?sort=name_asc

## How to Run

### Install Dependencies

npm install

### Start the Server

npm start

### Development Mode

npm run dev

### Server URL

http://localhost:3000

## Authentication

Employee APIs require a JWT token.

Add the token in the request header:

Authorization: Bearer <token>

## Project Structure

employee-management-server/
├── package.json
├── .gitignore
├── .env
├── README.md
└── src/
    ├── server.js
    ├── config/
    ├── controllers/
    ├── data/
    │   ├── employees.json
    │   └── users.json
    ├── routes/
    ├── services/
    └── utils/

## Security

- Passwords are stored as bcrypt hashes.
- JWT is used for authentication.
- JWT secret is stored in .env.
- .env is excluded from Git using .gitignore.