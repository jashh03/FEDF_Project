import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarView from '../components/CalendarView';
import SlotPicker from '../components/SlotPicker';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => { fetchDoctor(); }, [id]);
  useEffect(() => { if (selectedDate && doctor) fetchSlots(); }, [selectedDate, doctor]);

  const fetchDoctor = async () => {
    try { const res = await axios.get(`/api/doctors/${id}`); setDoctor(res.data); } catch (error) { toast.error('Failed to load doctor'); navigate('/doctors'); } finally { setLoading(false); }
  };
  const fetchSlots = async () => {
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    setSlotsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await axios.get(`/api/doctors/available-slots?doctorId=${id}&date=${dateStr}`);
      setSlots(res.data);
      setSelectedSlot(null);
    } catch (error) { toast.error('Failed to load slots'); } finally { setSlotsLoading(false); }
  };
  const handleBooking = async () => {
    if (!selectedSlot) return toast.error('Select a time slot');
    try {
      await axios.post('/api/appointments/book', { doctor_id: parseInt(id), appointment_time: selectedSlot.datetime, reason: reason || 'General consultation' });
      toast.success('Appointment booked!');
      navigate('/my-appointments');
    } catch (error) { toast.error(error.response?.data?.error || 'Booking failed'); }
  };
  if (loading) return <div className="text-center py-12">Loading...</div>;
z
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Doctor Info */}
        <div className="glass-card p-8 card-hover">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full p-4">
              <span className="text-5xl">👨‍⚕️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Dr. {doctor.name}</h1>
              <p className="text-blue-600 font-semibold text-lg">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1 text-yellow-500">⭐ {doctor.rating}</div>
            </div>
          </div>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-2"><span className="text-xl">📍</span> {doctor.location}</div>
            <div className="flex items-center gap-2"><span className="text-xl">⏰</span> {doctor.working_start} - {doctor.working_end}</div>
            <div className="flex items-center gap-2"><span className="text-xl">💰</span> <span className="text-2xl font-bold text-blue-600">₹{doctor.fee}</span> <span className="text-sm">per consultation</span></div>
            <div className="flex items-center gap-2"><span className="text-xl">📞</span> {doctor.phone || 'Not available'}</div>
            <div className="flex items-center gap-2"><span className="text-xl">📧</span> {doctor.email || 'Not available'}</div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="space-y-6">
          <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <SlotPicker slots={slots} selectedSlot={selectedSlot} onSlotSelect={setSelectedSlot} loading={slotsLoading} />
          {selectedSlot && (
            <div className="glass-card p-6 card-hover animate-slide-up">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Confirm Booking</h3>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="input-field mb-4" rows="3" placeholder="Reason for visit (optional)" />
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-5">
                <p className="font-semibold text-gray-700">Selected Appointment:</p>
                <p>📅 {selectedDate.toLocaleDateString()}</p>
                <p>🕐 {selectedSlot.time}</p>
                <p>👨‍⚕️ Dr. {doctor.name}</p>
              </div>
              <button onClick={handleBooking} className="btn-primary w-full">Confirm Booking</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DoctorDetail;