## 📦 Project Setup
- [x] Initialize project structure (`client/`, `server/`)
- [x] Set up React + Vite + TypeScript in `client/`
- [x] Set up Node.js + Express + TypeScript in `server/`
- [x] Install and configure Prisma
- [x] Create `.env` file and connect PostgreSQL
- [x] Create base Prisma `User` and `Booking` models
- [x] Run initial Prisma migration
- [x] Set up CORS and JSON parsing in Express
- [x] Test basic frontend ↔ backend connection

## 🔐 Authentication (User System)
- [x] Create register + login forms (React)
- [x] Set up `/auth/register` and `/auth/login` endpoints
- [x] Use JWT for authentication
- [x] Store token in localStorage or cookies
- [x] Create middleware to protect backend routes
- [x] Add user role handling (`client` / `admin`)

## 🏠 Pages & Navigation
- [x] Build basic `Home` page
- [x] Add `Navbar` with route links
- [x] Configure React Router
- [x] Add `NotFound` / 404 page
- [ ] Check All of the configuration before continuing

## 👤 User Dashboard
- [ ] Create `/profile` page (show bookings, invoices)
- [ ] Add `/api/user/me` endpoint to fetch current user
- [ ] Protect profile route with auth

## 📅 Booking System
- [ ] Create `BookingForm` component
- [ ] Create `/api/bookings` POST route
- [ ] Display user bookings in `BookingList`
- [ ] Create `/api/bookings/:id` DELETE route
- [ ] Add date validation / prevent overlapping

## 🧑‍💼 Admin Panel
- [ ] Create `/admin` route & dashboard
- [ ] Add route to fetch all bookings (`/api/admin/bookings`)
- [ ] Add route to manage users or services
- [ ] Create middleware to restrict access to admins

## 🧾 Invoices / Services (Optional)
- [ ] Add `Invoice` model in Prisma
- [ ] Create `/api/invoices` CRUD routes
- [ ] Auto-generate invoice on booking/payment
- [ ] Build `Invoices` page for users/admin

## 🎨 UI & UX Polish
- [ ] Add Tailwind for styling
- [ ] Make pages responsive
- [ ] Add spinners/loading states
- [ ] Add toast notifications (e.g. react-toastify)

## 🧪 Testing & Debugging
- [ ] Manually test all auth/booking routes
- [ ] Validate frontend forms
- [ ] Handle all backend errors properly
- [ ] Add 404 and server error messages

## 🚀 Deployment
- [ ] Deploy frontend to Vercel / Netlify
- [ ] Deploy backend to Render / Railway
- [ ] Host PostgreSQL DB (Supabase, Neon, etc.)
- [ ] Set up environment variables in production
- [ ] Test deployed version end-to-end