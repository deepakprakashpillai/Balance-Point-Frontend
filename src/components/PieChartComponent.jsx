import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export const PieChartComponent = ({ totalWorkoutIntensityCount }) => {
  // Format the intensity data dynamically from the prop
  const intensityData = [
    { id: 0, value: totalWorkoutIntensityCount.high, label: 'High' },
    { id: 1, value: totalWorkoutIntensityCount.medium, label: 'Medium' },
    { id: 2, value: totalWorkoutIntensityCount.low, label: 'Low' },
  ];

  return (
    <PieChart
      series={[
        {
          data: intensityData,
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          innerRadius: 20,
          outerRadius: 70,
          paddingAngle: 3,
          cornerRadius: 5,
          cx: 100,
          cy: 70,
        },
      ]}
      width={300}
      height={150}
    />
  );
};
