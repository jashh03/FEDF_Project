import React from 'react';
import { format } from 'date-fns';

const AppointmentCard = ({ appointment, onCancel, onReschedule, onReminder }) => {
  const statusColors = {
    scheduled: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return (
    <div className="glass-card p-5 card-hover animate-fade-in">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold gradient-text">Dr. {appointment.doctor_name}</h3>
          <p className="text-gray-600 mt-1">{appointment.specialty}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm text-gray-600">
            <p>📍 {appointment.location}</p>
            <p>📅 {format(new Date(appointment.appointment_time), 'PPP')}</p>
            <p>🕐 {format(new Date(appointment.appointment_time), 'p')}</p>
            {appointment.fee && <p>💰 ₹{appointment.fee}</p>}
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>
      </div>
      {appointment.status === 'scheduled' && (
        <div className="mt-5 flex flex-wrap gap-3 pt-3 border-t border-gray-100">
          <button onClick={() => onReminder(appointment.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium shadow">
            🔔 Send Reminder
          </button>
          <button onClick={() => onReschedule(appointment)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium shadow">
            📅 Reschedule
          </button>
          <button onClick={() => onCancel(appointment.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium shadow">
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  );
};
export default AppointmentCard;