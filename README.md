# <p align="center">🏠 DreamHomes Backend API</p>

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![License](https://img.shields.io/badge/License-MIT-green)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

<p align="center">
  A scalable, production-ready, and fully-featured RESTful API backend for the <strong>DreamHomes Real Estate Platform</strong>. Built following clean architecture principles, featuring role-based access control, messaging, notification systems, and robust database management.
</p>

---

## 🗺️ System Architecture

Below is the complete architectural flowchart of the backend system, showing the data flow, middleware layer, MVC separation, and integration points:

<p align="center">
  <img src="./backend-flowchart.png" alt="DreamHomes Backend System Flowchart" width="100%" />
</p>

---
## 📋 Project Info

| Item | Value |
|------|-------|
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Authentication | JWT |
| Deployment | Render |
| Architecture | MVC |

##  Features

-  **Secure Authentication:** JWT authentication with access tokens and secure, HTTP-only refresh token cookies.
-  **Role-Based Access Control (RBAC):** Separate routes and permission scopes for `USER`, `AGENT`, and `ADMIN`.
-  **Property Management:** Comprehensive CRUD operations for listing, updating, deleting, and searching luxury homes.
-  **Favorites System:** Custom list of favorites per user with database synchronization.
-  **Real-time Messaging:** Direct chat communication with prospective buyers/agents.
-  **Instant Notifications:** Real-time push updates for chat messages and system events.
- **Admin Control Panel:** Dedicated analytics, user banning/unbanning, and platform moderation tools.
-  **Prisma ORM:** Simplified and safe database access, schema-first design, and seamless migrations.

---

# 📂 Project Structure

```
DreamHomesback
│
├── prisma/
│   └── schema.prisma         # Database Models & Configurations
│
├── src/
│   ├── config/               # Database, Cloudinary, and Third-Party API setups
│   ├── middlewares/          # Validation, error handling, rate limiting, and auth guards
│   ├── modules/              # Feature-based modular structure
│   │   ├── admin/            # Admin operations & statistics
│   │   ├── auth/             # Login, signup, reset password
│   │   ├── favorites/        # User favorites list CRUD
│   │   ├── messages/         # Direct messages & conversations
│   │   ├── notifications/    # Push notifications & records
│   │   ├── properties/       # Property listings & search engine
│   │   └── users/            # Profiles, avatars, and user settings
│   │
│   ├── utils/                # Custom helper classes (AppError, ApiResponse)
│   └── app.js                # Express app setup and middleware registration
│
├── server.js                 # Entry point (Server initialization)
├── package.json
└── .env.example
```

---

# ⚙️ Local Installation & Development

### 1. Clone the repository
```bash
git clone https://github.com/Dalinalkuwatli1/DreamHomesback.git
cd DreamHomesback
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres.xxxxx:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET="your_refresh_token_secret"
JWT_REFRESH_EXPIRES_IN=30d

CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

## 🗄️ Database Configuration

This project is configured to use **Supabase PostgreSQL**. Use the **Session Pooler (port 5432)** for both `DATABASE_URL` and `DIRECT_URL`:

- `DATABASE_URL`: Used by the application at runtime. Use port `5432` (Session Pooler).
- `DIRECT_URL`: Used by Prisma for schema operations (`db push`, migrations). Also port `5432`.

### 4. Prisma Sync
Synchronize the models with your database:
```bash
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```

---

# 📡 API Documentation & Endpoints

### 🔑 Authentication (`/api/auth`)

#### 1. Register User
* **Endpoint:** `POST /api/auth/register`
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "USER" },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

#### 2. User Login
* **Endpoint:** `POST /api/auth/login`
* **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```

---

### 🏠 Properties (`/api/properties`)

#### 1. Get All Listings
* **Endpoint:** `GET /api/properties?search=Cairo&minPrice=100000`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "Luxury Villa in Fifth Settlement",
        "price": 4500000,
        "location": "Cairo",
        "bedrooms": 4,
        "bathrooms": 3
      }
    ]
  }
  ```

#### 2. Create Listing (Authenticated / Agent / Admin)
* **Endpoint:** `POST /api/properties`
* **Headers:** `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body:**
  ```json
  {
    "title": "Modern Apartment Downtown",
    "description": "Stunning apartment near the city center.",
    "price": 250000,
    "location": "Alexandria",
    "address": "12 Port Said St.",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 120
  }
  ```

---

## ☁️ Deployment

### Deploy to Render

1. Create a Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Configure the following build settings:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `node server.js`
4. Add all environment variables from `.env` in Render's "Environment" tab.

### Deploy to Railway

1. Install the Railway CLI or use the web dashboard.
2. Link your project to the GitHub repository.
3. Railway automatically detects `package.json` and starts the app with the defined start script.

---

## 🔌 Frontend Integration

To connect your React / Vite frontend application to this backend API, configure the following setting in your frontend environment.

### 1. Environment Variable (`.env`)
In your frontend project root directory:
```env
VITE_API_URL=https://dreamhomesback.onrender.com/api
```

### 2. Axios Instance Setup
Ensure CORS credentials are enabled to allow HTTP-only cookies (refresh tokens) to pass:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // Required for HTTP-only cookies / Refresh Tokens
});

export default api;
```

---

# 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
