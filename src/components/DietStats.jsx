import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const DietStatsGraph = ({ rmr, averageCalorieIntake, caloriesNeededForGoal }) => {
  const data = [
    {
      id: 'Calories',
      color: '#2A9D8F',
      data: [
        { x: 'RMR', y: rmr },
        { x: 'Avg Intake', y: averageCalorieIntake },
        { x: 'Calories Needed', y: caloriesNeededForGoal },
      ],
    },
  ];

  return (
    <div style={{ height: 140, width: '100%' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 30, bottom: 40, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 10,
          tickPadding: 10,
          tickRotation: 0,
          legend: '',
          legendOffset: 36,
          legendPosition: 'middle',
        }}

        enableGridX={false}
        enableGridY={false}
        colors={['#2A9D8F']}
        pointSize={8}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
        useMesh={true}
        enableArea={true}
        curve="cardinal"
        areaBaselineValue = {rmr}
        axisLeft = {null}
        lineWidth={8}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: '#ddd',
              },
            },
            ticks: {
              text: {
                fontSize: 12,
                fill: '#333',
              },
            },
          },
          grid: {
            line: {
              stroke: 'transparent',
            },
          },
        }}
        tooltip={({ point }) => (
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              padding: '5px 10px',
              color: '#fff',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <strong>{point.serieId}</strong>
            <br />
            {point.data.x}: {point.data.y} kcal
          </div>
        )}
      />
    </div>
  );
};

const DietStats = ({ rmr, averageCalorieIntake, caloriesNeededForGoal }) => {
  return (
    <div className="col-span-2 row-span-2 bg-transparent rounded-lg text-white">
      <DietStatsGraph
        rmr={rmr}
        averageCalorieIntake={averageCalorieIntake}
        caloriesNeededForGoal={caloriesNeededForGoal}
      />
    </div>
  );
};

export default DietStats;
