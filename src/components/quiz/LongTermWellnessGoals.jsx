import React, { useState } from 'react';
import WellnessImage from '../../assets/Info.png';;

const LongTermWellnessGoals = ({ onBack, onNext, handleChange }) => { 
  const [wellnessData, setWellnessData] = useState({ 
    main_wellness_goal: '', 
    self_motivation: 5,
    biggest_challenge: '',
  });

  const handleEntryChange = (e) => {
    handleChange(e); // calling parent function
    const { name, value } = e.target;
    setWellnessData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSliderChange = (e) => {
    handleChange(e);
    setWellnessData((prevData) => ({
      ...prevData,
      self_motivation: parseInt(e.target.value),
    }));
  };

  const getEmoji = () => {
    if (wellnessData.self_motivation <= 2) return '😞';
    if (wellnessData.self_motivation <= 4) return '😐';
    if (wellnessData.self_motivation <= 6) return '😊';
    if (wellnessData.self_motivation <= 8) return '😃';
    return '🤩';
  };

  const handleNext = () => {
    onNext(wellnessData); // pass the data onNext
  };

  return (
      <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200 w-100">
        <h2 className="text-lg font-bold mb-4">Set Your Long-Term Wellness Goals</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
        </div>

        <form className="space-y-4">
          {/* Main Wellness Goal Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Select Your Main Wellness Goal:</label>
            <select
              name="main_wellness_goal"
              value={wellnessData.main_wellness_goal}
              onChange={handleEntryChange}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Select an option</option>
              <option value="Physical Health">Physical Health</option>
              <option value="Mental Wellbeing">Mental Wellbeing</option>
              <option value="Emotional Balance">Emotional Balance</option>
              <option value="Social Connections">Social Connections</option>
              <option value="Overall Wellness">Overall Wellness</option>
            </select>
          </div>

          {/* Self Motivation Slider with Emoji */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">How motivated do you feel? (1-10)</label>
            <input
              type="range"
              name="self_motivation" 
              min="1"
              max="10"
              value={wellnessData.self_motivation}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none "
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(wellnessData.self_motivation - 1) * 10}%, #d1d5db ${(wellnessData.self_motivation) * 10}%, #d1d5db 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              {[...Array(10)].map((_, index) => (
                <span key={index + 1}>{index + 1}</span>
              ))}
            </div>
            <p className="text-center mt-4 text-5xl">{getEmoji()}</p>
          </div>

          {/* Biggest Challenge Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">What’s your biggest challenge right now?</label>
            <select
              name="biggest_challenge"
              value={wellnessData.biggest_challenge}
              onChange={handleEntryChange}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="" disabled>Select an option</option>
              <option value="Time Management">Time Management</option>
              <option value="Motivation">Motivation</option>
              <option value="Stress Management">Stress Management</option>
              <option value="Access to Resources">Access to Resources</option>
              <option value="Support System">Support System</option>
            </select>
          </div>

        </form>
      </div>
  ); 
}; 
 
export default LongTermWellnessGoals;
