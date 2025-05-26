# Monteina Management System

Monteina Management System is a comprehensive platform for managing services, bookings, and user interactions. It includes both a **frontend** built with React + Vite and a **backend** powered by Node.js + Express + Prisma.

## 🌐 Production Deployment

### **Frontend**
- Deployed on **Netlify**: [Monteina Management](https://monteina.netlify.app)
- The frontend is built using React and Vite, providing a fast and responsive user interface.

### **Backend**
- Deployed on **Render**
- The backend is powered by Node.js and Express, handling API requests and business logic.

### **Database**
- Hosted on **Supabase**: A PostgreSQL database is used to store all application data, including users, services, bookings, and more.

---

## Features

- **Admin Panel**: Manage services, users, and bookings with ease.
- **Booking System**: Allow users to book services with a calendar interface.
- **User Dashboard**: View bookings, invoices, and profile details.
- **Invoice Management**: View customer invoices directly from the admin order management interface.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.
- **Authentication**: Secure login and role-based access control.
- **Notifications**: Toast notifications for user feedback.
- **Terms and Conditions**: Detailed service terms page for legal compliance and transparency.

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
   - Create a `.env` file in the `server/` directory with the following.
    - Local:
      ```
      PORT=your_port
      NODE_ENV=development

      DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
      JWT_SECRET=your_secret_key

      EMAIL_USER=your_email_user
      EMAIL_PASS=your_email_pass

      CARQUERY_API_URL=your_car_query_api_url
      ```

    - Production:
      - Everything stays the same as in local development only `NODE_ENV` changes and addition of `VITE_BACKEND_URL` is needed:
      
        ```
        NODE_ENV=production
        VITE_BACKEND_URL=your_backend_url
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
  - `/api/checkout` - Handle order checkout and status updates
  - `/api/carquery?callback=?&cmd=getMakes` - Handle car makes

---

## 📂 Project Structure

### Frontend (`client/`)
- **`src/api/`**: API-specific features like fetching, information from server folder or other endpoints.
- **`src/components/`**: Reusable UI components (e.g., `NavBar`, `Footer`).
- **`src/context/`**: Reusable Loading context.
- **`src/features/auth`**: User Authentication (e.g., `Login` `ResetPassword`).
- **`src/pages/`**: Page-level components for admins and tenants (e.g., `Home`, `Profile`, `AdminDashboard`).
- **`src/styles/`**: SCSS and CSS files for styling.
- **`src/tenant/`**: Tenant-specific features like booking, profile management, and terms.
- **`src/admin/`**: Admin-specific features like managing users, services, and viewing invoices.

### Backend (`server/`)
- **`src/routes/`**: API routes for authentication, services, and bookings.
- **`src/middleware/`**: Middleware for authentication and role-based access.
- **`src/utils/`**: Utility functions (e.g., email notifications, logging).
- **`prisma/`**: Database schema and migrations.
- **`logs/`**: Stores server logs, including API access logs, error logs, and debug info. Useful for monitoring and troubleshooting production environments.
- **`env`**: Environment variables file. Contains sensitive or environment-specific configurations like database URLs, API keys, and ports. Should not be committed to version control.

### Root
- **`README.md`**: Project overview and usage instructions. Typically includes setup steps, features, environment configuration, and contact or contribution guidelines.
- **`ToDo.md`**: A running checklist or backlog of tasks, features, or bugs to be addressed. Helps with planning and tracking project progress.
- **`.gitignore`**: Specifies files and directories to be ignored by Git. Commonly includes node_modules, environment files, and build outputs.

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
- Multi-language Support.
- Enhanced admin analytics dashboard.

---

## 🧪 Testing
- **Frontend**: Use React Testing Library for component testing.
- **Backend**: Use Jest for API endpoint testing.

---

## 🔄 Development History & Roadmap

### 🚀 Phase 1: Project Inception (March 2025)
- **UI/UX Design**: Established the initial user interface and experience layouts using Figma, focusing on intuitive navigation and user-centric design.
- **Navigation Structure**: Outlined the primary navigation flow to ensure seamless user interaction across the platform.

### 🛠️ Phase 2: Technical Foundation (April 2025)
- **Frontend Setup**: Initialized the frontend using React with Vite for efficient development and optimized performance.
- **Backend Architecture**: Configured the backend with Node.js, Express, and Prisma ORM to manage server-side operations and database interactions.
- **Database Integration**: Established a robust database schema to support dynamic data handling and scalability.

### 🌐 Phase 3: Full Website Development (May 2025)
- **Responsive Design Implementation**: Translated Figma designs into a responsive web application, ensuring compatibility across devices.
- **Admin Panel Development**: Created an administrative interface for managing services, users, and bookings efficiently.
- **Booking System Integration**: Implemented a calendar-based booking system allowing users to schedule services seamlessly.
- **User Dashboard Creation**: Developed a personalized dashboard for users to view and manage bookings, invoices, and profile information.
- **Invoice Management**: Enabled administrators to access and manage customer invoices directly from the order management interface.
- **Authentication Mechanism**: Established secure login and registration processes with role-based access control.
- **Notification System**: Integrated real-time toast notifications to enhance user feedback.
- **Terms and Conditions Page**: Added a comprehensive service terms section to inform users about policies and legalities.

### 🔮 Phase 4: Planned Updates
- **Invoice PDF Generation**: Develop functionality to generate and download invoices in PDF format for user convenience.
- **Multi-language Support**: Implement localization features to support multiple languages.
- **Enhanced Analytics Dashboard**: Build an advanced dashboard to help administrators analyze user behavior, bookings, and service performance.

---

## 📜 License
This project is licensed under the MIT License.
