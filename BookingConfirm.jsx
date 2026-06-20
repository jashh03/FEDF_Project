import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const BookingConfirm = () => {
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.appointment || null);

  if (!booking) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="glass-card max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold text-red-600">No booking data</h2>
        <Link to="/doctors" className="btn-primary mt-4 inline-block">Find a Doctor</Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-20 animate-fade-in">
      <div className="glass-card max-w-2xl mx-auto p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Appointment Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl text-left mb-6">
          <p><strong>Doctor:</strong> Dr. {booking.doctor_name}</p>
          <p><strong>Specialty:</strong> {booking.specialty}</p>
          <p><strong>Date:</strong> {new Date(booking.appointment_time).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(booking.appointment_time).toLocaleTimeString()}</p>
          <p><strong>Location:</strong> {booking.location}</p>
          <p><strong>Fee:</strong> ${booking.fee}</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/my-appointments" className="btn-primary">View My Appointments</Link>
          <Link to="/doctors" className="btn-secondary">Book Another</Link>
        </div>
      </div>
    </div>
  );
};
export default BookingConfirm;