import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import ConfirmEmail from './features/auth/ConfirmEmail';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './features/admin/Dashboard';
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

import './styles/main.scss';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" 
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}/>
        <Route path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}/>
        <Route path="/confirm" element={<ConfirmEmail />} />
        <Route path="/dashboard" element={
          <ProtectedRoute roles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route
          path="/profile" element={
            <ProtectedRoute roles={['admin', 'client']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/services" element={<Services />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;