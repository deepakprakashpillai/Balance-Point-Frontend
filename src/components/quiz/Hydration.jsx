import React, { useState } from 'react';
import WaterImage from '../../assets/Info.png'; // Import your image

const Hydration = ({ handleChange }) => {
  const [hydrationData, setHydrationData] = useState({
    average_water_intake: 8, // Default average water intake
  });

  const handleSliderChange = (e) => {
    handleChange(e)
    setHydrationData({ average_water_intake: e.target.value });
  };

  const handleNext = () => {
    onNext(hydrationData);
  };

  return (

      <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
        <h2 className="text-lg font-bold mb-4">Let’s Talk About Your Hydration!</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <p className="mb-4 text-gray-600">
          On average, how many glasses of water do you drink in a day?
        </p>

        {/* Water Intake Slider */}
        <div className="flex items-center">
          <input
            type="range"
            name = "average_water_intake"
            min="0"
            max="15"
            value={hydrationData.average_water_intake}
            onChange={handleSliderChange}
            className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
            style={{ height: '10px' }} // Adjusting the height of the slider
          />
        </div>

        {/* Display Selected Intake */}
        <div className="text-center mt-2">
        <span className="text-xl font-semibold mr-2">{hydrationData.average_water_intake}</span>
          <span className="text-gray-600">glasses of water</span>
        </div>

        
      </div>

  );
};

export default Hydration;
