# Product Catalog Management API

A secure and scalable RESTful API for managing product catalog data using Node.js, Express.js, MongoDB, and Mongoose.

The API provides authenticated product management, advanced search and filtering, pagination, input validation, analytics through MongoDB aggregation, and secure API access.

## Features

* RESTful API architecture
* Product creation, retrieval, updating, and soft deletion
* JWT-based authentication
* Protected product management endpoints
* Search products by name, description, or brand
* Filter products by category
* Filter products by minimum and maximum price
* Pagination support
* MongoDB aggregation-based product analytics
* Category-wise product statistics
* Average, minimum, and maximum price analysis
* Stock analysis
* Input validation using Express Validator
* Centralized error handling
* API rate limiting
* HTTP security headers with Helmet
* CORS support
* Request logging with Morgan
* Password hashing with bcryptjs
* Environment variable configuration
* MongoDB indexing for improved query performance

## Tech Stack

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| Node.js            | JavaScript runtime            |
| Express.js         | REST API framework            |
| MongoDB            | Database                      |
| Mongoose           | MongoDB object modeling       |
| JWT                | Authentication                |
| bcryptjs           | Password hashing              |
| Express Validator  | Request validation            |
| Helmet             | HTTP security                 |
| CORS               | Cross-origin resource sharing |
| Morgan             | HTTP request logging          |
| Express Rate Limit | API rate limiting             |
| dotenv             | Environment configuration     |

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
├── server.js
└── README.md
```

## API Base URL

```text
http://localhost:5000
```

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

Protected endpoints require the following HTTP header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Authentication is required for creating, updating, and deleting products, as well as accessing product analytics.

## Authentication Endpoints

### Register

**POST**

```text
/api/auth/register
```

Example request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

### Login

**POST**

```text
/api/auth/login
```

Example request:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

A successful login returns a JWT token that can be used to access protected endpoints.

### Current User

**GET**

```text
/api/auth/me
```

Requires authentication.

## Product Endpoints

| Method | Endpoint                  | Authentication | Description           |
| ------ | ------------------------- | -------------- | --------------------- |
| POST   | `/api/products`           | Required       | Create a product      |
| GET    | `/api/products`           | Not required   | Get products          |
| GET    | `/api/products/:id`       | Not required   | Get a product by ID   |
| PUT    | `/api/products/:id`       | Required       | Update a product      |
| DELETE | `/api/products/:id`       | Required       | Soft-delete a product |
| GET    | `/api/products/analytics` | Required       | Get product analytics |

## Create Product

**POST**

```text
/api/products
```

Requires a valid JWT token.

Example request:

```json
{
  "name": "Smart Fitness Band",
  "description": "A modern fitness band with activity tracking and health monitoring features.",
  "category": "electronics",
  "price": 6999,
  "stock": 35,
  "brand": "FitNova",
  "image": "https://example.com/fitness-band.jpg"
}
```

## Get All Products

**GET**

```text
/api/products
```

Returns active products with pagination information.

Example:

```text
/api/products?page=1&limit=10
```

The response includes:

* Current page
* Total pages
* Total products
* Page limit
* Next-page availability
* Previous-page availability

## Search Products

Products can be searched by product name, description, or brand.

Example:

```text
/api/products?search=fitness
```

The API uses a MongoDB text index to support text-based product searching.

## Filter by Category

Example:

```text
/api/products?category=electronics
```

Supported categories:

* electronics
* clothing
* home
* beauty
* sports
* books
* groceries
* other

## Filter by Price Range

Products can be filtered using minimum and maximum price values.

Example:

```text
/api/products?minPrice=6000&maxPrice=7000
```

The API validates the price range and prevents an invalid maximum price below the minimum price.

## Pagination

Example:

```text
/api/products?page=1&limit=10
```

The maximum allowed page size is 100 products.

Pagination helps reduce response size and improves API efficiency when working with larger product collections.

## Combined Search and Filtering

Search, category, price filtering, and pagination can be combined.

Example:

```text
/api/products?search=fitness&category=electronics&minPrice=5000&maxPrice=10000&page=1&limit=10
```

This allows clients to perform more advanced product discovery through a single API endpoint.

## Get Product by ID

**GET**

```text
/api/products/:id
```

Example:

```text
/api/products/PRODUCT_ID
```

The API validates MongoDB ObjectIds before processing the request.

## Update Product

**PUT**

```text
/api/products/:id
```

Requires authentication.

Example:

```json
{
  "price": 7499,
  "stock": 40
}
```

Only approved product fields can be updated.

Protected fields such as `isActive` cannot be modified through the product update endpoint.

## Delete Product

**DELETE**

```text
/api/products/:id
```

Requires authentication.

The API uses soft deletion by setting the product's `isActive` field to `false`.

This approach keeps the record in the database while preventing deleted products from appearing in normal product listings.

## Product Analytics

**GET**

```text
/api/products/analytics
```

Requires authentication.

The analytics endpoint uses MongoDB aggregation to generate:

* Total number of active products
* Total stock quantity
* Average product price
* Minimum product price
* Maximum product price
* Category-wise product count
* Category-wise average price
* Category-wise stock quantity

The aggregation pipeline uses MongoDB's `$facet` and `$group` operations to produce multiple analytical results efficiently.

## Data Validation

The API validates incoming requests before processing them.

Validation includes:

* Required product fields
* Product name length
* Description length
* Valid product categories
* Non-negative prices
* Whole-number stock quantities
* Valid image URLs
* Valid email addresses
* Strong password requirements
* Valid MongoDB product IDs
* Valid pagination values
* Valid price ranges

Invalid requests return structured validation errors with the affected field and corresponding message.

## Security

Several security measures are implemented:

### JWT Authentication

Protected endpoints require valid authentication tokens.

### Password Hashing

User passwords are hashed using bcryptjs before being stored in MongoDB.

### Helmet

Helmet adds security-related HTTP headers to API responses.

### Rate Limiting

Authentication and general API requests are rate-limited to reduce excessive or abusive requests.

### CORS

CORS is configured to allow controlled cross-origin API access.

### Input Validation

Express Validator validates user input before controller execution.

### Protected Fields

Sensitive and system-managed fields cannot be modified through unauthorized request bodies.

### Environment Variables

Sensitive configuration such as the MongoDB connection string and JWT secret is stored in environment variables rather than committed to source control.

## Error Handling

The API provides centralized error handling for common problems including:

* Invalid MongoDB IDs
* Validation errors
* Duplicate database records
* Authentication failures
* Expired JWT tokens
* Unauthorized requests
* Missing resources
* Server errors

Responses use a consistent JSON structure.

Example:

```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

## Environment Configuration

Create a `.env` file in the project root:

```text
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/product_catalog_db
JWT_SECRET=your_secure_jwt_secret
```

Never commit the real `.env` file or secret values to GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/rNoureen64/Product_Catalog_API.git
```

Navigate into the project:

```bash
cd Product_Catalog_API
```

Install dependencies:

```bash
npm install
```

Configure the `.env` file.

Make sure MongoDB is running.

Start the development server:

```bash
npm start
```

The API will run on:

```text
http://localhost:5000
```

## Testing

The API was tested using Postman.

Testing covered:

1. User login authentication
2. Authenticated product creation
3. Retrieving all products
4. Product search
5. Category filtering
6. Price-range filtering
7. Authenticated product update
8. MongoDB aggregation analytics
9. Invalid input validation
10. Unauthorized access protection

The testing evidence is documented separately with Postman screenshots.

## Example Successful Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "name": "Smart Fitness Band",
    "category": "electronics",
    "price": 6999,
    "stock": 35
  }
}
```

## Example Validation Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "category",
      "message": "Invalid product category"
    }
  ]
}
```

## Database Indexing

The Product model includes indexes for frequently queried fields.

Indexes are configured for:

* Product text search
* Category
* Price
* Creation date

These indexes help improve query performance for product discovery and sorting operations.

## Project Objectives

This project was developed to demonstrate practical backend development skills including:

* REST API development
* Database design
* MongoDB and Mongoose
* Authentication and authorization
* Secure API development
* Input validation
* Advanced querying
* Pagination
* Aggregation pipelines
* Error handling
* API testing
* Git and GitHub workflow

## Future Improvements

Potential future enhancements include:

* Role-based administrative dashboard
* Product image upload using cloud storage
* Product reviews and ratings
* Wishlist functionality
* Inventory alerts
* Advanced sorting options
* API documentation using Swagger/OpenAPI
* Automated testing with Jest and Supertest
* Docker containerization
* Production deployment with a managed MongoDB service

## Repository

GitHub Repository:

https://github.com/rNoureen64/Product_Catalog_API

## License

This project is developed for educational and internship purposes.
