import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-4 z-50 mx-4 glass-card shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-bold gradient-text flex items-center gap-2">
            <span className="text-3xl">🏥</span> DoctorAppoint
          </Link>
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/doctors" className="hover:text-blue-600 transition">Find Doctors</Link>
            {user && (
              <>
                <Link to="/my-appointments" className="hover:text-blue-600 transition">My Appointments</Link>
                <Link to="/profile" className="hover:text-blue-600 transition">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="hover:text-blue-600 transition">Admin Panel</Link>}
              </>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                  👋 {user.name}
                </span>
                <button onClick={() => { logout(); navigate('/login'); }} className="btn-primary text-sm px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;