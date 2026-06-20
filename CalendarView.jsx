import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarView = ({ selectedDate, onDateChange }) => {
  const tileDisabled = ({ date }) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return date < today;
  };
  return (
    <div className="glass-card p-6 card-hover">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Select Date</h3>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        tileDisabled={tileDisabled}
        minDate={new Date()}
        className="border-0 w-full"
      />
    </div>
  );
};
export default CalendarView;