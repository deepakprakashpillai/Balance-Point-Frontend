import React, { useState } from 'react';

const MoodFrequencyOptions = [
  { value: 'rarely', emoji: '😃', label: 'Rarely' },
  { value: 'occasionally', emoji: '😊', label: 'Occasionally' },
  { value: 'often', emoji: '😐', label: 'Often' },
  { value: 'almost_always', emoji: '😞', label: 'Almost Always' },
];

const MentalHealthAndMood = ({ onBack, onNext, handleChange }) => {
  const [mentalHealthData, setMentalHealthData] = useState({
    stress_level: 5,
    mood_frequency: '',
    mood_improvement_goal: '',
  });

  // Handle change for slider inputs and dropdowns
  const handleStateChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...mentalHealthData, [name]: value };
    setMentalHealthData(updatedData);
    handleChange(e); // Pass the event to handleChange to comply with its expected structure
  };

  const handleMoodFrequencyChange = (value) => {
    // Update local state in MentalHealthAndMood
    setMentalHealthData((prevData) => {
      const updatedData = { ...prevData, mood_frequency: value };
      return updatedData;
    });
    // Only call handleChange after the state has been updated (on a next render)
    setTimeout(() => {
      const fakeEvent = {
        target: {
          name: 'mood_frequency',
          value: value,
        },
      };
      handleChange(fakeEvent); // Call handleChange with the fake event after the render phase
    }, 0);
  };

  const handleNext = () => {
    onNext(mentalHealthData);
  };

  return (
    <div className="flex-1 p-8 bg-white rounded-lg transition-all duration-200">
      <h2 className="text-lg font-bold mb-4">Let’s Talk About Your Mental Health</h2>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
      </div>

      <form className="space-y-4">
        {/* Stress Level Slider */}
        <div>
          <label className="block text-gray-700 mb-1">On a scale of 1 to 10, how would you rate your stress level?</label>
          <input
            type="range"
            name="stress_level"
            value={mentalHealthData.stress_level}
            onChange={handleStateChange} // Call handleStateChange for slider
            min="1"
            max="10"
            className="w-full h-4 appearance-none bg-gray-200 rounded-lg cursor-pointer"
            style={{ height: '10px' }} // Adjusting the height of the slider
          />
          <div className="text-center mt-2">Stress Level: {mentalHealthData.stress_level}/10</div>
        </div>

        {/* Mood Frequency with Emojis */}
        <div>
          <label className="block text-gray-700 mb-1">How often do you feel low?</label>
          <div className="flex justify-around">
            {MoodFrequencyOptions.map((option) => (
              <div
                key={option.value}
                className={`flex flex-col items-center cursor-pointer transition duration-200 transform ${
                  mentalHealthData.mood_frequency === option.value
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-500 scale-105'
                    : 'text-gray-400'
                } hover:scale-110 p-2 rounded-lg`}
                onClick={() => handleMoodFrequencyChange(option.value)} // Handle mood frequency change
              >
                <span className="text-5xl">{option.emoji}</span>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Improvement Goal Dropdown */}
        <div>
          <label className="block text-gray-700 mb-1">What would you like to improve in your mood?</label>
          <select
            name="mood_improvement_goal"
            value={mentalHealthData.mood_improvement_goal}
            onChange={handleStateChange} // Call handleStateChange for dropdown
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your goal</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="More Physical Activity">More Physical Activity</option>
            <option value="Gratitude Journal">Gratitude Journal</option>
            <option value="Connect with Others">Connect with Others</option>
            <option value="Establish a Sleep Routine">Establish a Sleep Routine</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default MentalHealthAndMood;
