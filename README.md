<p align="center">
  <h1 align="center">Taskify Backend</h1>
  <p align="center">A powerful microservices-based task management system built with NestJS</p>
</p>

## Overview

Taskify Backend is a robust task management system built using a microservices architecture with NestJS. The system consists of multiple services handling users, projects, and tasks, orchestrated through an API gateway.

## Notion
[Link of Notion](https://aspiring-plum-d49.notion.site/17ece7ae9590808498e3d8164f9eb34a?v=17ece7ae959081d2b991000c95572145)

## Prerequisites

- Node.js (v22 or higher)
- PostgreSQL
- bun

## Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone git@github.com:andresdvelez/taskify-back.git
   cd taskify-backend
   ```

2. **Environment Configuration**

   ```bash
   # Copy the environment template file
   cp .env.template .env
   ```

3. **Configure Database**

   - Create a PostgreSQL database for the project
   - Update the following environment variables in your `.env` file:
     ```
     DB_HOST=your_host
     DB_PORT=your_port
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     DB_DATABASE=your_database_name
     ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

## Running the Application

Start each microservice in a separate terminal:

1. **Users Service**

   ```bash
   bun run start users
   ```

2. **Projects Service**

   ```bash
   bun run start projects
   ```

3. **Tasks Service**

   ```bash
   bun run start tasks
   ```

4. **API Gateway**
   ```bash
   bun run start taskify-api-gateway
   ```

## Initial Setup

### Creating the First Admin User

After starting all services, you'll need to create the first admin user to access the system. Use the following endpoint:

**Endpoint:** `http://localhost:3001/users`

**Method:** POST

**Payload Template:**

```json
{
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "otp": null,
  "otpExpiry": null,
  "password": "your_secure_password",
  "projects": []
}
```

Once the admin user is created, you can use the frontend application to create additional users and manage the system.

## Services Architecture

- **API Gateway** (Port: 3001) - Main entry point for client applications
- **Users Service** (Port: 4001) - Handles user management and authentication
- **Projects Service** (Port: 4002) - Manages project-related operations
- **Tasks Service** (Port: 4003) - Handles task creation and management

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
