import React from 'react';

const WeeklyConsistencyCalendar = ({ activeDays }) => {
  // Array representing all days of the week (Mon to Sun)
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Map through allDays to determine which days are active or rest 
  const dayStatus = allDays.map((day) => ({
    day,
    status: activeDays.includes(day) ? 'active' : 'rest',
  }));

  return (
    <div className="grid grid-cols-7 gap-2">
      {dayStatus.map(({ day, status }) => (
        <div
          key={day}
          className={`flex items-center justify-center rounded-lg h-20 text-sm font-semibold transition-all duration-300 ease-in-out cursor-pointer
            ${status === 'active'
              ? 'border-2 border-yellow-400 text-yellow-600' // Active day: yellow border and text
              : 'border-2 border-red-400 text-red-600'} // Rest day: red border and text
            bg-transparent hover:shadow-md`}
        >
          {status === 'active' ? (
            day
          ) : (
            <span className="text-lg font-bold text-red-600">✖</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeeklyConsistencyCalendar;
