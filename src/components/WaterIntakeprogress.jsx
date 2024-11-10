// WaterIntakeProgress.js
import React from 'react';
import { Flex, Progress } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const WaterIntakeProgress = ({ currentIntake, goal }) => {
  const progressPercent = (currentIntake / goal) * 100;

  return (
    <Flex gap="small" wrap>
      {progressPercent >= 100 ? (
        // Display checkmark if the goal is reached or exceeded
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '110px' }} />
      ) : (
        // Display progress circle if below goal
        <Progress 
          type="circle" 
          percent={progressPercent} 
          format={() => `${currentIntake} / ${goal} L`} 
          status="normal" 
        />
      )}
    </Flex>
  );
};

export default WaterIntakeProgress;
