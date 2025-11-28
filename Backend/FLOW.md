# API Flow Documentation

Complete step-by-step API flows for Customer and Admin operations.

## 📋 Customer Order Flow (Detailed)

### 1. Account Setup

**New Customer Registration:**

```bash
POST /api/signup
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Existing Customer Login:**

```bash
POST /api/login
{
  "email": "giri.customer@commerce.com",
  "password": "password"
}
```

> **Save JWT token** from response for all subsequent requests

### 2. Profile Creation (New Customers)

```bash
POST /api/users/profile
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-15"
}
```

### 3. Address Management (New Customers)

```bash
POST /api/users/addresses
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "is_default": true
}
```

### 4. Browse Products

**Get Categories:**

```bash
GET /api/categories
```

**Get Products by Category:**

```bash
GET /api/products?categoryId=<CATEGORY_ID>
```

**Search Products:**

```bash
GET /api/products?search=laptop&minPrice=500&maxPrice=2000&page=1&limit=10
```

### 5. Shopping Cart Management

**Add to Cart:**

```bash
POST /api/cart
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "productId": "<PRODUCT_ID>",
  "quantity": 2
}
```

**View Cart:**

```bash
GET /api/cart
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Update Cart Item:**

```bash
PUT /api/cart/<PRODUCT_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "quantity": 3
}
```

### 6. Payment Setup

**Create Stripe Customer:**

```bash
POST /api/stripe/customers
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

### 7. Order Placement

```bash
POST /api/orders
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "shippingAddress": {
    "full_name": "John Doe",
    "phone": "+1234567890",
    "address_line1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

> **Save paymentIntent.id** from response

### 8. Payment Completion

```bash
POST /api/stripe/process-payment
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "paymentIntentId": "<PAYMENT_INTENT_ID>",
  "paymentMethodId": "pm_card_visa"
}
```

**Test Account**: `giri.customer@commerce.com` / `password`

---

## 🔧 Admin Management Flow (Detailed)

### 1. Admin Login

```bash
POST /api/login
{
  "email": "giri.admin@commerce.com",
  "password": "password"
}
```

> **Save JWT token** for admin operations

### 2. Create New Admin (Admin Only)

```bash
POST /api/users/create-admin
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "email": "newadmin@commerce.com",
  "password": "adminpass123"
}
```

### 3. Category Management

**Create Category:**

```bash
POST /api/categories
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets"
}
```

**Update Category:**

```bash
PUT /api/categories/<CATEGORY_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "name": "Updated Electronics",
  "description": "Updated description"
}
```

**Delete Category:**

```bash
DELETE /api/categories/<CATEGORY_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
```

### 4. Product Management

**Create Product (JSON):**

```bash
POST /api/products
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "stock": 50,
  "categoryId": "<CATEGORY_ID>",
  "isActive": true
}
```

**Create Product with Images (Form Data):**

```bash
POST /api/products/upload
Headers: Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Form Data:
- name: "iPhone 15 Pro"
- description: "Latest Apple smartphone"
- price: 999.99
- stock: 50
- categoryId: "<CATEGORY_ID>"
- mainImage: [file]
- additionalImages: [file1, file2, ...]
```

**Update Product:**

```bash
PUT /api/products/<PRODUCT_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "name": "Updated iPhone 15 Pro",
  "price": 899.99,
  "stock": 30
}
```

**Delete Product:**

```bash
DELETE /api/products/<PRODUCT_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
```

### 5. Product Image Management

**Add Product Image:**

```bash
POST /api/product-images
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "productId": "<PRODUCT_ID>",
  "imageUrl": "https://cloudinary.com/image.jpg",
  "publicId": "cloudinary_public_id"
}
```

**Update Product Image:**

```bash
PUT /api/product-images/<IMAGE_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "imageUrl": "https://cloudinary.com/new-image.jpg",
  "publicId": "new_cloudinary_public_id"
}
```

**Delete Product Image:**

```bash
DELETE /api/product-images/<IMAGE_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
```

### 6. User Management (Admin Only)

**Get All Users:**

```bash
GET /api/users
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Update User:**

```bash
PUT /api/users/<USER_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "email": "updated@example.com",
  "role": "customer"
}
```

**Delete User:**

```bash
DELETE /api/users/<USER_ID>
Headers: Authorization: Bearer <JWT_TOKEN>
```

### 7. Order Management (Admin Only)

**Update Order Status:**

```bash
PATCH /api/orders/<ORDER_ID>/status
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "status": "processing"
}
```

### 8. System Health Monitoring

**Get System Health:**

```bash
GET /api/system-health
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Create Health Record:**

```bash
POST /api/system-health
Headers: Authorization: Bearer <JWT_TOKEN>
{
  "server_status": "UP",
  "cpu_usage": 45.2,
  "memory_usage": 67.8,
  "disk_usage": 23.1
}
```

**Test Admin Account**: `giri.admin@commerce.com` / `password`

---

## 📊 Additional API Endpoints

### Authentication & Token Management

- `POST /api/logout` - User logout
- `POST /api/refresh` - Refresh JWT token
- `GET /api/verify` - Verify token validity
- `GET /api/me` - Get current user info

### Profile & Address Management

- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `PUT /api/addresses/:id` - Update specific address
- `DELETE /api/addresses/:id` - Delete address

### Advanced Product Features

- `GET /api/products/:id` - Get single product details
- `GET /api/products/:productId/images` - Get product images

### Cart Operations

- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Order History & Management

- `GET /api/orders/:orderId` - Get specific order details
- `PATCH /api/orders/:orderId/cancel` - Cancel order
- `PATCH /api/orders/:orderId/complete-payment` - Complete payment

### Payment Methods

- `POST /api/payment-methods/create` - Create & save payment method
- `POST /api/payment-methods` - Save existing payment method
- `GET /api/payment-methods` - Get saved payment methods
- `DELETE /api/payment-methods/:id` - Delete payment method

### Stripe Integration

- `POST /api/stripe/setup-intents` - Create setup intent for saving cards
- `POST /api/stripe/payment-intents` - Create payment intent
- `GET /api/stripe/customers/:customerId/cards` - Get customer's saved cards
- `POST /api/stripe/webhooks` - Stripe webhook handler

---

## 🧪 Test Data

### Test Accounts

- **Customer**: `giri.customer@commerce.com` / `password`
- **Admin**: `giri.admin@commerce.com` / `password`

### Stripe Test Payment Methods

- **Visa**: `pm_card_visa`
- **Mastercard**: `pm_card_mastercard`
- **American Express**: `pm_card_amex`
- **Declined Card**: `pm_card_chargeDeclined`

### Sample Request Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Sample Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 📝 Notes

- All protected endpoints require JWT token in Authorization header
- Admin endpoints require admin role
- File uploads use multipart/form-data
- All responses follow standardized format
- Rate limiting applies to all endpoints
- CORS is configured for cross-origin requests

For more information, see:

- **Main Documentation**: `README.md`
- **API Documentation**: http://localhost:5005/api-docs
- **Database Schema**: `../DB/readme/DATABASE_SCHEMA.md`
