# Project Overview and Objectives

This project is a backend API for a basic e-commerce system developed using NestJS. It provides essential functionalities such as user management, product management, and role-based access control, designed with scalability and maintainability in mind.

## Key Features

- **User Management:** Allows users to register, log in, and manage their profiles. Admins have the ability to ban/unban users.
- **Role-Based Access Control:** Differentiates between regular users and admins, with specific permissions for each role.
- **Product Management:** Enables authenticated users to create, update, and delete their own products. Admins can approve or disapprove products.
- **Approval Workflow:** Only products approved by an admin are visible to unauthenticated users.

## Architecture

The project adheres to clean architecture principles, where business logic is separated from the database layer and other external dependencies. This is achieved by limiting direct database interactions to the service layer. The service layer interfaces with the database through an abstract repository, allowing for flexibility in switching databases with minimal code changes. For instance, transitioning from MongoDB to PostgreSQL would only require modifications at the repository levels.

### Modular Design

The project is organized into distinct modules, with each module encapsulating a specific aspect of the application.This structure ensures that each module is self-contained, making it easier to manage and scale the application as it grows.
Each feature is encapsulated in its own module. For example:

- The `users` module handles all user-related operations.
- The `products` module manages product-related functionality.

### Reusability

Common functionalities are abstracted into the `common` module, which includes utilities, decorators, guards, middleware and pipe, ensuring code reuse and reducing duplication.

## Project Setup

To set up the development environment:

1. **Clone the GitHub repository.**
2. **Install necessary environment variables.**
3. **Install dependencies using Yarn install** 
4. **Start the server using `yarn start:dev`.**

## Project Structure
src
├── users
├── token
├── products
├── common
│   ├── db
│   ├── decorator
│   ├── enum
│   ├── function
│   ├── guard
│   ├── interface
│   ├── middleware
│   ├── pipe
│   ├── validator
.env.example
README.md
