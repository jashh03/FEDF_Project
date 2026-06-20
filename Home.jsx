import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section with floating shapes */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Book Doctor Appointments <span className="text-yellow-300">Instantly</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find the best doctors, check real-time availability, and secure your appointment in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/doctors" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Find a Doctor →
              </Link>
              <Link to="/register" className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center card-hover">
            <div className="text-4xl mb-2">👨‍⚕️</div>
            <div className="text-3xl font-bold gradient-text">100+</div>
            <div className="text-gray-600">Expert Doctors</div>
          </div>
          <div className="glass-card p-6 text-center card-hover">
            <div className="text-4xl mb-2">😊</div>
            <div className="text-3xl font-bold gradient-text">5000+</div>
            <div className="text-gray-600">Happy Patients</div>
          </div>
          <div className="glass-card p-6 text-center card-hover">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-bold gradient-text">4.9</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 text-center card-hover">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
            <p className="text-gray-600">Filter by specialty, location, or doctor name instantly.</p>
          </div>
          <div className="glass-card p-8 text-center card-hover">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Slots</h3>
            <p className="text-gray-600">See live availability and book without conflicts.</p>
          </div>
          <div className="glass-card p-8 text-center card-hover">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
            <p className="text-gray-600">Get email reminders for upcoming appointments.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to book your appointment?</h2>
          <p className="text-xl mb-6">Join thousands of satisfied patients today.</p>
          <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition inline-block shadow-lg">
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Home;