import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import ConfirmEmail from './features/auth/ConfirmEmail';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import NotFound from './pages/NotFound';
import Services from './pages/Services';
import Calendar from './pages/Calendar';
import Footer from './components/Footer';
import FAQ from './pages/FAQ';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation'

import AdminNavBar from './components/AdminNavBar';
import ManageOrders from './pages/admin-pages/ManageOrders';
import ManageServices from './pages/admin-pages/ManageServices';
import AdminDashboard from './pages/admin-pages/AdminDashboard';
import ManageUsers from './pages/admin-pages/ManageUsers';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './styles/main.scss';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const Nav = userRole === 'admin' ? AdminNavBar : NavBar;
  const AdminRoutes = (
    <>
      <Route 
        path="/admin/orders"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageOrders />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/services"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageServices />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </>
  );

  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/faq" element={<FAQ />} />
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
        
        {userRole === "admin" && AdminRoutes}

        <Route path="*" element={<NotFound />}></Route>
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Router>
  );
}

export default App;