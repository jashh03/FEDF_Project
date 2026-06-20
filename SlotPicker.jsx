import React from 'react';

const SlotPicker = ({ slots, selectedSlot, onSlotSelect, loading }) => {
  if (loading) return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Available Slots</h3>
      <div className="text-center py-8 text-gray-500 animate-pulse">Loading slots...</div>
    </div>
  );
  return (
    <div className="glass-card p-6 card-hover">
      <h3 className="text-xl font-semibold mb-4 gradient-text">Available Time Slots</h3>
      {slots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No available slots for selected date</div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => onSlotSelect(slot)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                selectedSlot?.datetime === slot.datetime
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                  : 'bg-white/60 backdrop-blur-sm border border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default SlotPicker;