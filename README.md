# Micro Marketplace App

A full-stack Micro Marketplace application with a Node.js backend, React web frontend, and React Native mobile app.

## Features

- **Backend**: Node.js, Express, Prisma, SQLite, JWT Authentication.
- **Web App**: React, Vite, Tailwind CSS, Responsive Design.
- **Mobile App**: React Native, Expo, Expo Router.
- **Core Functionality**:
  - User Registration & Login (JWT).
  - Product Listing with Search & Pagination.
  - Product Details.
  - Favorites System (Add/Remove).
  - Creative UI elements (animations).

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
node prisma/seed.js  # Seeding data
npm start
```

Server runs on `http://localhost:5001`.

### 2. Web App Setup

```bash
cd web
npm install
npm run dev
```

App runs on `http://localhost:5173`.

### 3. Mobile App Setup

```bash
cd mobile
npm install
npx expo start
```

Use Expo Go on your phone or an emulator to run the app.
**Note**: The app is configured to use your machine's local IP (currently `10.12.78.158`) on port `5001`. Ensure your phone is on the same Wi-Fi network. Update `mobile/api/axios.ts` if your IP changes.

## API Endpoints

- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `GET /products` - List products (query: `page`, `limit`, `search`)
- `GET /products/:id` - Get product details
- `POST /favorites` - Toggle favorite
- `GET /favorites` - Get user favorites

## Tech Stack

- **Backend**: Node.js, Express, Prisma, SQLite
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Mobile**: React Native, Expo
