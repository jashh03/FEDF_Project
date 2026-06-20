import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentCard from '../components/AppointmentCard';
import toast from 'react-hot-toast';

const BookingHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try { const res = await axios.get('/api/appointments/my-appointments'); setAppointments(res.data); } catch (error) { toast.error('Failed to load appointments'); } finally { setLoading(false); }
  };
  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try { await axios.put(`/api/appointments/${id}/cancel`); toast.success('Cancelled'); fetchAppointments(); } catch (error) { toast.error('Failed'); }
    }
  };
  const handleReschedule = async (apt) => {
    const newDateTime = prompt('Enter new date and time (YYYY-MM-DDTHH:MM:SS)', apt.appointment_time);
    if (newDateTime) {
      try { await axios.put(`/api/appointments/${apt.id}/reschedule`, { new_time: newDateTime }); toast.success('Rescheduled'); fetchAppointments(); } catch (error) { toast.error(error.response?.data?.error || 'Failed'); }
    }
  };
  const handleReminder = async (id) => {
    try { await axios.post('/api/reminders/send', { appointment_id: id }); toast.success('Reminder sent'); } catch (error) { toast.error('Failed'); }
  };
  const upcoming = appointments.filter(a => a.status === 'scheduled' && new Date(a.appointment_time) > new Date());
  const past = appointments.filter(a => a.status !== 'scheduled' || new Date(a.appointment_time) <= new Date());

  if (loading) return <div className="text-center py-12">Loading...</div>;
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-center gradient-text mb-8">My Appointments</h1>
      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🟢 Upcoming Appointments</h2>
          <div className="space-y-4">{upcoming.map(apt => <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancel} onReschedule={handleReschedule} onReminder={handleReminder} />)}</div>
        </div>
      )}
      {past.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">📋 Past Appointments</h2>
          <div className="space-y-4">{past.map(apt => <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancel} onReschedule={handleReschedule} onReminder={handleReminder} />)}</div>
        </div>
      )}
      {appointments.length === 0 && (
        <div className="glass-card text-center py-12">
          <p className="text-gray-500">No appointments found.</p>
          <Link to="/doctors" className="btn-primary mt-4 inline-block">Book an Appointment</Link>
        </div>
      )}
    </div>
  );
};
export default BookingHistory;