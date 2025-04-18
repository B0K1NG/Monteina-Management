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
      </Routes>
    </Router>
  );
}

export default App;