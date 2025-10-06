# Clothing Management System Backend

This is the backend for the Clothing Management System, built with Express.js and PostgreSQL.

## Features

- User authentication (login, forgot password, reset password)
- Product management (CRUD operations)
- Inventory management
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd BACKEND
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a PostgreSQL database named `clothing_management`

5. Import the database schema:
   ```
   psql -U postgres -d clothing_management -f ../clothing-management-db-schema.sql
   ```

6. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=8080
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=clothing_management
   DB_PASSWORD=postgres
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key_here
   ```

7. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products (protected)
- `GET /api/products/low-stock` - Get low stock products (protected)
- `GET /api/products/:id` - Get product by ID (protected)
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `PUT /api/products/:id/inventory` - Update product inventory (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Development

To run the server in development mode with auto-restart:

```
npm run dev
```

## Production

To run the server in production mode:

```
npm start
``` 