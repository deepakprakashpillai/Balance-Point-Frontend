import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const MoodGraph = ({ dailyMood }) => {
  // Ensure dailyMood is an array and map it to chartData
  if (!Array.isArray(dailyMood)) {
    return <div>Error: dailyMood is not an array</div>;
  }

  const moodToValue = (mood) => {
    switch (mood) {
      case 'happy':
        return 6;
      case 'calm':
        return 4;
      case 'tired':
        return 3;
      case 'stressed':
        return 2;
      case 'energized':
        return 5;
      case 'unhappy':
        return 1;
      default:
        return 0;
    }
  };

  // Create chart data from dailyMood, with added logging
  const chartData = dailyMood.map((entry) => ({
    date: entry.date,
    value: moodToValue(entry.mood),
    mood: entry.mood,
  }));

  console.log("Chart Data:", chartData); // Log to check the values

  return (
    <div className="bg-transparent p-4 px-1 rounded-lg">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          {/* Grid Lines */}
          <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />
          
          {/* X and Y Axis */}
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#555" }} />
          <YAxis 
            tick={{ fontSize: 12, fill: "#555" }}
            domain={['dataMin', 'dataMax']} // Ensure Y-Axis adjusts to the data range
          />
          
          {/* Tooltip */}
          <Tooltip 
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { date, mood } = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <p className="text-sm font-semibold text-gray-700">Date: {date}</p>
                  <p className="text-lg font-bold text-gray-900">Mood: {mood}</p>
                </div>
              );
            }}
            labelStyle={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}
            itemStyle={{ fontSize: '12px', color: '#555' }} 
          />

          {/* Legend */}
          <Legend iconType="circle" iconSize={8} layout="horizontal" verticalAlign="top" />
          
          {/* Line Style */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#6C63FF" 
            activeDot={{ r: 8 }} 
            strokeWidth={3} 
            dot={{ r: 4 }} 
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodGraph;
