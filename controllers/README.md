# Product Catalog Management API

A professional RESTful API for managing products with secure authentication, advanced search, filtering, pagination, MongoDB aggregation analytics, validation, rate limiting, and production-oriented error handling.

## Overview

The Product Catalog Management API is a backend application built with Node.js, Express.js, and MongoDB.

It provides secure endpoints for creating, reading, updating, and deleting products while supporting advanced product discovery through search, category filtering, price filtering, and pagination.

The API also includes JWT-based authentication and protected product management endpoints.

## Features

- RESTful API architecture
- Product CRUD operations
- MongoDB database integration
- Mongoose ODM
- JWT authentication
- Secure password hashing with bcrypt
- Protected API endpoints
- Role-based authorization middleware
- Product search
- Category filtering
- Minimum and maximum price filtering
- Pagination
- MongoDB aggregation analytics
- Product statistics
- Input validation
- MongoDB ObjectId validation
- Update field protection
- Soft delete functionality
- Global error handling
- API rate limiting
- Authentication rate limiting
- Helmet security headers
- CORS support
- Request logging with Morgan
- Environment variable configuration
- Clean and scalable project structure

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- express-validator
- express-rate-limit
- Helmet
- CORS
- Morgan
- dotenv
- Postman

## Project Structure

```text
product_catalog_api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── authValidation.js
│   ├── errorMiddleware.js
│   ├── productValidation.js
│   └── rateLimitMiddleware.js
│
├── models/
│   ├── Product.js
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── utils/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js