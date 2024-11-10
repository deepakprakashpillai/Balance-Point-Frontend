import React, { useState } from 'react';
import GoalImage from '../../assets/Info.png';;

const GoalSetting = ({ handleChange }) => {
  const [goalData, setGoalData] = useState({
    goal: '',
    target_weight: '',
    height: '',
    weight: '',
  });

  const handleEntry = (e) =>
  {
    handleChange(e);
    const { name, value } = e.target;
    setGoalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }


  return (

      <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
        <h2 className="text-lg font-bold mb-4">Goal Setting</h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '1%' }}></div>
        </div>

        <form className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={goalData.weight}
              onChange={handleEntry}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 70"
            />
          </div>
            <div className="flex-1">
              <label className="block text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={goalData.height}
                onChange={handleEntry}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 170"
              />
            </div>
          </div>
          {/* Primary Health Goal */}
          <div>
            <label className="block text-gray-700 mb-1">Primary Health Goal</label>
            <select
              name="goal"
              value={goalData.goal}
              onChange={handleEntry}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your goal</option>
              <option value="Maintain">Maintain weight</option>
              <option value="Loss">Lose weight</option>
              <option value="Gain">Gain weight</option>
            </select>
          </div>

          {/* Target Weight (Visible only if 'Lose weight' or 'Gain weight' is selected) */}
          {(goalData.goal === 'Loss' || goalData.goal === 'Gain') && (
            <div>
              <label className="block text-gray-700 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                name="target_weight"
                value={goalData.target_weight}
                onChange={handleEntry}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 65"
              />
            </div>
          )}

          
        </form>
      </div>

  );
};

export default GoalSetting;
