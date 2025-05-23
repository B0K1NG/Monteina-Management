import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import ConfirmEmail from './features/auth/ConfirmEmail';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';

import Profile from './pages/tenant-pages/Profile';
import Home from './pages/tenant-pages/Home';
import NavBar from './components/NavBar';
import NotFound from './pages/tenant-pages/NotFound';
import Services from './pages/tenant-pages/Services';
import Calendar from './pages/tenant-pages/Calendar';
import Footer from './components/Footer';
import FAQ from './pages/tenant-pages/FAQ';
import Terms from './pages/tenant-pages/Terms';
import Checkout from './pages/tenant-pages/Checkout';
import Confirmation from './pages/tenant-pages/Confirmation';


import AdminNavBar from './components/AdminNavBar';
import AdminFooter from './components/AdminFooter';
import ManageOrdersPage from './pages/admin-pages/ManageOrders';
import ManageServicesPage from './pages/admin-pages/ManageServices';
import AdminDashboardPage from './pages/admin-pages/AdminDashboard';
import ManageUsersPage from './pages/admin-pages/ManageUsers';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles/main.scss';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (userRole === 'admin') {
      rootElement?.classList.add('admin-root');
    } else {
      rootElement?.classList.remove('admin-root');
    }
  }, [userRole]);

  const Nav = userRole === 'admin' ? AdminNavBar : NavBar;
  const FooterComponent = userRole === 'admin' ? AdminFooter : Footer;
  const AdminRoutes = (
    <>
      <Route 
        path="/admin/orders"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/services"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageServicesPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </>
  );

  return (
    <LoadingProvider>
    <Router>
      <div className='app-container'>
      <LoadingOverlay />
      <Nav />
      <div className='content'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        
        <Route
          path="/profile" element={
            <ProtectedRoute roles={['client', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/register" 
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}/>
        <Route path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}/>
        <Route path="/confirm" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {userRole === "admin" && AdminRoutes}

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      </div>

      <FooterComponent />
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
    </LoadingProvider>
  );
}

export default App;