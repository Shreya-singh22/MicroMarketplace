# Micro Marketplace

A full-stack marketplace application with Web and Mobile interfaces.

## Features
- **User Authentication**: Register and Login.
- **Product Browsing**: View products with search and pagination.
- **Shopping Cart**: Add items, update quantities, removable items.
- **Checkout**: Seamless checkout process.
- **Favorites**: Save items for later.
- **Cross-Platform**: Web (React) and Mobile (React Native) apps.

## Tech Stack
- **Backend**: Node.js, Express, SQLite (Prisma).
- **Frontend**: React, Vite, Tailwind CSS.
- **Mobile**: React Native, Expo.

## Deployment

### Backend (Render/Railway/Heroku)
1.  Connect this repository.
2.  Set Root Directory to `backend`.
3.  Build Command: `npm install && npx prisma generate`.
4.  Start Command: `npm start`.
5.  **Environment Variables**:
    - `JWT_SECRET`: Your secret key.
    - `PORT`: (Optional, usually provided by host).

### Frontend (Vercel/Netlify/Render)
1.  Connect this repository.
2.  Set Root Directory to `web`.
3.  Build Command: `npm run build`.
4.  Output Directory: `dist`.
5.  **Environment Variables**:
    - `VITE_API_URL`: URL of your deployed backend (e.g., `https://your-backend.onrender.com`).

### Mobile
1.  Navigate to `mobile` folder.
2.  Run `npx expo start`.
3.  Scan QR code with Expo Go app.
