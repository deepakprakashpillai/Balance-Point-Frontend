import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const CalorieGraph = ({ dailyCalorieSummary = [] }) => {
  // Check if the data is available and is an array
  if (!Array.isArray(dailyCalorieSummary) || dailyCalorieSummary.length === 0) {
    return <div>No data available</div>;
  }

  // Sort the dailyCalorieSummary by date in descending order and get the latest 7 data points
  const sortedData = [...dailyCalorieSummary]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sorting by date, newest first
    .slice(0, 7).reverse(); // Keep only the latest 7 entries

  return (
    <div className="bg-transparent p-4 px-1 rounded-lg">
      <ResponsiveContainer width="100%" height={230}>
        <LineChart data={sortedData}>
          {/* Grid Lines */}
          <CartesianGrid strokeDasharray="5 5" stroke="#e0e0e0" />

          {/* X and Y Axis */}
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#555" }} />
          <YAxis tick={{ fontSize: 12, fill: "#555" }} label={{ value: 'Calories', angle: -90, position: 'insideLeft' }} />

          {/* Tooltip showing calories */}
          <Tooltip 
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const { date, calories } = payload[0].payload;
              return (
                <div className="bg-white rounded-lg shadow-md">
                  <p className="text-sm font-semibold text-gray-700">Date: {date}</p>
                  <p className="text-lg font-bold text-gray-900">Calories: {calories}</p>
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
            dataKey="calories" 
            stroke="#FF6347" 
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

export default CalorieGraph;
