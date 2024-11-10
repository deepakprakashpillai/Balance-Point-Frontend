import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export const PieChartDietComponent = ({ totalMealExperienceData }) => {
  // Extract the meal experience data and exclude the 'total' value
  const mealExperienceData = Object.entries(totalMealExperienceData)
    .filter(([experience, count]) => experience !== 'total' && count > 0) // Filter out 'total' and zero values
    .map(([experience, count]) => ({
      id: experience, // Use experience as id
      value: count,   // Use count as the value
      label: experience // Set the experience as the label
    }));

  return (
    <PieChart
      series={[
        {
          data: mealExperienceData, // Use dynamically generated data
          highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          innerRadius: 20,
          outerRadius: 70,
          paddingAngle: 3,
          cornerRadius: 5,
          cx: 100,
          cy: 110
        }
      ]}
      width={330}
      height={230}
    />
  );
};

