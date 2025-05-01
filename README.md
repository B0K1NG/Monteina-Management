# Monteina Management System

Monteina Management System is a comprehensive platform for managing services, bookings, and user interactions. It includes both a **frontend** built with React + Vite and a **backend** powered by Node.js + Express + Prisma.

## Features

- **Admin Panel**: Manage services, users, and bookings with ease.
- **Booking System**: Allow users to book services with a calendar interface.
- **User Dashboard**: View bookings, invoices, and profile details.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Authentication**: Secure login and role-based access control.
- **Notifications**: Toast notifications for user feedback.

---

## 🛠️ Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/monteina-management.git
   cd monteina-management
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Frontend
   cd client
   npm install

   # Backend
   cd ../server
   npm install
   ```

3. Set up the database:
   - Create a `.env` file in the `server/` directory with the following:
     ```
     DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
     JWT_SECRET=your_secret_key
     ```
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

4. Start the development servers:
   ```bash
   # Frontend
   cd client
   npm run dev

   # Backend
   cd ../server
   npm run dev
   ```

---

## 🚀 Usage

### Frontend
- Access the frontend at `http://localhost:5173`.
- Navigate through the user dashboard, booking system, and admin panel.

### Backend
- The backend runs at `http://localhost:3000`.
- API endpoints include:
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login
  - `/api/services` - Manage services
  - `/api/bookings` - Manage bookings

---

## 📂 Project Structure

### Frontend (`client/`)
- **`src/components/`**: Reusable UI components (e.g., `NavBar`, `Footer`).
- **`src/pages/`**: Page-level components for routing (e.g., `Home`, `Profile`).
- **`src/styles/`**: SCSS and CSS files for styling.
- **`src/tenant/`**: Tenant-specific features like booking and profile management.
- **`src/admin/`**: Admin-specific features like managing users and services.

### Backend (`server/`)
- **`src/routes/`**: API routes for authentication, services, and bookings.
- **`src/middleware/`**: Middleware for authentication and role-based access.
- **`src/utils/`**: Utility functions (e.g., email notifications, logging).
- **`prisma/`**: Database schema and migrations.

---

## 🧩 Key Imports

### Frontend
- **React Router**: For navigation
  ```tsx
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  ```
- **Toast Notifications**: For user feedback
  ```tsx
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  ```
- **Axios**: For API requests
  ```tsx
  import axios from '../api/axios';
  ```

### Backend
- **Express**: For server setup
  ```ts
  import express from 'express';
  ```
- **Prisma**: For database interaction
  ```ts
  import { PrismaClient } from '@prisma/client';
  const prisma = new PrismaClient();
  ```
- **JWT**: For authentication
  ```ts
  import jwt from 'jsonwebtoken';
  ```

---

## 🌟 Features in Development
- Invoice generation for bookings.
- Enhanced admin analytics dashboard.

---

## 🧪 Testing
- **Frontend**: Use React Testing Library for component testing.
- **Backend**: Use Jest for API endpoint testing.

---

## 📜 License
This project is licensed under the MIT License.