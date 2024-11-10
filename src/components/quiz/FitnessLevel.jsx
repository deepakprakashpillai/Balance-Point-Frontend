import React, { useState } from 'react';
import FitnessImage from '../../assets/Info.png'; // Import your image

const FitnessLevel = ({ handleChange }) => {
  const [fitnessData, setFitnessData] = useState({
    activity_level: '',
    exercise_frequency: '',
    exercise_type: '',
    exercise_duration: '',
  });

  const handleEntry = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    setFitnessData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    onNext(fitnessData);
  };

  return (

      <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
        <h2 className="text-lg font-bold mb-4">Let’s Talk About Your Fitness Level</h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18%' }}></div>
        </div>

        <form className="space-y-4">
          {/* Activity Level */}
          <div>
            <label className="block text-gray-700 mb-1">How would you describe your activity level on a typical day?</label>
            <select
              name="activity_level"
              value={fitnessData.activity_level}
              onChange={handleEntry}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your activity level</option>
              <option value="Sedentary">Sedentary (little or no exercise)</option>
              <option value="Lightly active">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="Moderately active">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="Very active">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="Extra active">Extra active (very hard exercise, physical job, or training twice a day)</option>
            </select>
          </div>

          {/* Conditionally Rendered Fields */}
          {(fitnessData.activity_level === 'Moderately active' || 
          fitnessData.activity_level === 'Lightly active' || 
            fitnessData.activity_level === 'Very active' || 
            fitnessData.activity_level === 'Extra active') && (
            <>
              {/* Exercise Frequency */}
              <div>
                <label className="block text-gray-700 mb-1">How many days do you usually find time to exercise each week?</label>
                <input
                  type="number"
                  name="exercise_frequency"
                  value={fitnessData.exercise_frequency}
                  onChange={handleEntry}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="7"
                  placeholder="e.g., 3"
                />
              </div>

              {/* Type of Exercise and Exercise Duration in a Single Row */}
              <div className="flex space-x-4">
                {/* Type of Exercise */}
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">What type of exercise do you enjoy doing?</label>
                  <select
                    name="exercise_type"
                    value={fitnessData.exercise_type}
                    onChange={handleEntry}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type of exercise</option>
                    <option value="cardio">Cardio</option>
                    <option value="weightlifting">Weightlifting</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Exercise Duration */}
                <div className="flex-1">
                  <label className="block text-gray-700 mb-1">Average duration of each exercise session :</label>
                  <input
                    type="number"
                    name="exercise_duration"
                    value={fitnessData.exercise_duration}
                    onChange={handleEntry}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 30 (in minutes)"
                  />
                </div>
              </div>
            </>
          )}

          
        </form>
      </div>

  );
};

export default FitnessLevel;
