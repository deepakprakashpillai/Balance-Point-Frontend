import React, { useState } from 'react';
import SleepImage from '../../assets/Info.png'; // Import your image

const SleepPatterns = ({ handleChange }) => {
  const [sleepData, setSleepData] = useState({
    average_sleep_time: 7, 
    sleep_quality_rating: 5, 
    sleep_issues: '', 
  });

  const handleEntry = (e) => {
    const { name, value } = e.target;
    setSleepData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleChange(e);
  };

  const handleRatingChange = (rating) => {
    // Update the sleep data state
    setSleepData((prevData) => ({
      ...prevData,
      sleep_quality_rating: rating,
    }));

    // Manually create an event to pass to handleChange
    const event = {
      target: {
        name: 'sleep_quality_rating',
        value: rating,
      },
    };

    // Call handleChange with the created event
    handleChange(event);
  };

  return (
    <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
      <h2 className="text-lg font-bold mb-4">Let’s Explore Your Sleep Patterns</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '36%' }}></div>
      </div>

      <form className="space-y-4">
        {/* Average Sleep Time Slider */}
        <div>
          <label className="block text-gray-700 mb-1">On average, how many hours do you sleep per night?</label>
          <input
            type="range"
            name="average_sleep_time"
            value={sleepData.average_sleep_time}
            onChange={handleEntry}
            min="1"
            max="12"
            className="w-full h-4 appearance-none bg-gray-200 rounded-lg cursor-pointer"
            style={{ height: '10px' }} // Adjusting the height of the slider
          />
          <div className="text-center mt-2">{sleepData.average_sleep_time} hours</div>
        </div>

        {/* Sleep Quality Rating (Star Rating) */}
        <div>
          <label className="block text-gray-700 mb-1">How would you rate your sleep quality?</label>
          <div className="flex items-center justify-between">
            {[...Array(10)].map((_, index) => (
              <span
                key={index}
                className={`cursor-pointer text-2xl transition duration-200 ${index < sleepData.sleep_quality_rating ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={() => handleRatingChange(index + 1)} // Pass the rating number directly
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-center mt-2">Rating: {sleepData.sleep_quality_rating}/10</div>
        </div>

        {/* Sleep Issues */}
        <div>
          <label className="block text-gray-700 mb-1">Do you experience any sleep issues?</label>
          <select
            name="sleep_issues"
            value={sleepData.sleep_issues}
            onChange={handleEntry}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select any sleep issues</option>
            <option value="Insomnia">Insomnia</option>
            <option value="Nightmares">Nightmares</option>
            <option value="Stress or Anxiety">Stress or Anxiety</option>
            <option value="Discomfort">Discomfort</option>
            <option value="Irregular Sleep Schedule">Irregular Sleep Schedule</option>
            <option value="none">None</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default SleepPatterns;
