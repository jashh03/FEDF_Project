
            import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorSearch from './pages/DoctorSearch';
import DoctorDetail from './pages/DoctorDetail';
import BookingConfirm from './pages/BookingConfirm';
import BookingHistory from './pages/BookingHistory';
import PatientProfile from './pages/PatientProfile';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorSearch />} />
            <Route path="/doctor/:id" element={<PrivateRoute><DoctorDetail /></PrivateRoute>} />
            <Route path="/booking-confirm" element={<PrivateRoute><BookingConfirm /></PrivateRoute>} />
            <Route path="/my-appointments" element={<PrivateRoute><BookingHistory /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><PatientProfile /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminPanel /></PrivateRoute>} />
          </Routes>
          <Toaster position="top-right" toastOptions={{ className: 'rounded-xl', duration: 3000 }} />
        </div>
      </AuthProvider>
    </Router>
  );
}
export default App;