import React, { useState } from 'react';
import LifestyleImage from '../../assets/Info.png'; // Import your illustration

const LifestyleHabits = ({ handleChange }) => {
  const [lifestyleData, setLifestyleData] = useState({
    smokes: '',
    alcohol_consumption: 'No',
    mindfulness_practices: '',
    screen_time: 0, // default screen time
  });

  const handleEntry = (e) => {
    const { name, value } = e.target;
    setLifestyleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleChange(e); // Call handleChange for the parent component
  };

  const handleNext = () => {
    onNext(lifestyleData);
  };

  return (
    <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
      <h2 className="text-lg font-bold mb-4">Let’s Explore Your Lifestyle Habits</h2>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
      </div>
      <form className="space-y-4">
        {/* Smokes Option */}
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700">Do you smoke?</label>
          <div className="flex space-x-4">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                type="button"
                name="smokes"
                value={option}
                className={`w-24 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center 
                  ${lifestyleData.smokes === option ? 'bg-blue-500 text-white scale-105 shadow-lg' : 'bg-gray-100 text-gray-700'}
                  hover:bg-blue-600 hover:text-white hover:scale-105 hover:shadow-lg`}
                onClick={handleEntry}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Alcohol Consumption Option */}
        <div>
          <label className="block text-gray-700 mb-1">Alcohol Consumption:</label>
          <select
            name="alcohol_consumption"
            value={lifestyleData.alcohol_consumption}
            onChange={handleEntry}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your consumption level</option>
            <option value="None">None</option>
            <option value="Occasional">Occasional</option>
            <option value="Moderate">Moderate</option>
            <option value="Frequent">Frequent</option>
            <option value="Heavy">Heavy</option>
          </select>
        </div>

        {/* Mindfulness Practices Option */}
        <div className="flex justify-between items-center mb-4">
          <label className="block text-gray-700">Do you practice mindfulness?</label>
          <div className="flex space-x-4">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                name="mindfulness_practices"
                type="button"
                value={option}
                className={`w-24 h-10 rounded-lg border transition-all duration-200 flex items-center justify-center 
                  ${lifestyleData.mindfulness_practices === option ? 'bg-blue-500 text-white scale-105 shadow-lg' : 'bg-gray-100 text-gray-700'}
                  hover:bg-blue-600 hover:text-white hover:scale-105 hover:shadow-lg`}
                onClick={handleEntry}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Screen Time Slider */}
        <div>
          <label className="block text-gray-700 mb-1">Average Screen Time (hours per day):</label>
          <input
            type="range"
            name="screen_time"
            min="0"
            max="24"
            value={lifestyleData.screen_time}
            onChange={handleEntry}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
          />
          <div className="flex justify-between mt-2 text-gray-700">
            <span>0 hrs</span>
            <span>{lifestyleData.screen_time} hrs</span>
            <span>24 hrs</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LifestyleHabits;
