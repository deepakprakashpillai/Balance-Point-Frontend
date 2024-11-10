import React, { useState } from 'react';

// Import your illustrations
import Illustration1 from '../assets/Info.png'; 
import MentalHealthAndMood from '../components/quiz/MentalHealthAndMood'; 
import FitnessLevel from '../components/quiz/FitnessLevel';   
import GoalSetting from '../components/quiz/GoalSetting';   
import Hydration from '../components/quiz/Hydration';   
import LifeStyleHabits from '../components/quiz/LifestyleHabits'; 
import LongTermWellnessGoals from '../components/quiz/LongTermWellnessGoals'; 
import SleepPatterns from '../components/quiz/SleepPatterns'; 
import Success from '../components/quiz/Success'; 
import axios from 'axios' 
 
const AssessmentPage = () => { 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [answers, setAnswers] = useState({ 
    height: null, 
    weight: null, 
    goal: '', 
    target_weight: null, 
    activity_level: '', 
    exercise_frequency: null, 
    exercise_type: '', 
    exercise_duration: null,
    average_sleep_time: null,
    sleep_quality_rating: null,
    sleep_issues: '',
    average_water_intake: null,
    stress_level: null,
    mood_frequency: '',
    mood_improvement_goal: '',
    smokes: '',  // Will be "Yes" or "No"
    alcohol_consumption: '',
    mindfulness_practices: '',  // Will be "Yes" or "No"
    screen_time: null,
    main_wellness_goal: '',
    self_motivation: null,
    biggest_challenge: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // To track submission status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < assessmentData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async() => {
    const moodFrequencyMapping = {
      "rarely": 1,
      "occasionally": 2,
      "frequently": 3,
      "very frequently": 4,
    };
    const formattedAnswers = {
      ...answers,
      smokes: answers.smokes === "Yes",
      mindfulness_practices: answers.mindfulness_practices === "Yes",
      height: answers.height ? parseFloat(answers.height) : null,
      weight: answers.weight ? parseFloat(answers.weight) : null,
      target_weight: answers.target_weight ? parseFloat(answers.target_weight) : null,
      exercise_frequency: answers.exercise_frequency ? parseInt(answers.exercise_frequency) : null,
      exercise_duration: answers.exercise_duration ? parseInt(answers.exercise_duration) : null,
      average_sleep_time: answers.average_sleep_time ? parseFloat(answers.average_sleep_time) : null,
      average_water_intake: answers.average_water_intake ? parseFloat(answers.average_water_intake) : null,
      stress_level: answers.stress_level ? parseInt(answers.stress_level) : null,
      screen_time: answers.screen_time ? parseFloat(answers.screen_time) : null,
      self_motivation: answers.self_motivation ? parseInt(answers.self_motivation) : null,
      mood_frequency: moodFrequencyMapping[answers.mood_frequency] || null, // Mapping mood frequency to a number
      user: 3,
    };

    console.log("Formatted Answers:", formattedAnswers);
    // Add any additional submission logic or API call here

    try {
      const response = await axios.post("http://127.0.0.1:8000/user/assessment/", formattedAnswers);
      console.log(response.data);
      setIsSubmitted(true); // Mark as submitted on successful response
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  const assessmentData = [
    {
      component: <GoalSetting handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <FitnessLevel handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <SleepPatterns handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <Hydration handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <MentalHealthAndMood handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <LifeStyleHabits handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
    {
      component: <LongTermWellnessGoals handleChange={handleChange}/>, 
      illustration: Illustration1,
    },
  ];

  const CurrentComponent = isSubmitted ? <Success /> : assessmentData[currentIndex].component;
  const Illustration = isSubmitted ? Illustration1 : assessmentData[currentIndex].illustration;

  return (
    <div className="assessment-page flex justify-center items-center min-h-screen w-full">
      {/* Left Side - Illustration */}
      <div className="left-side flex justify-center items-center w-[40%] max-w-[500px]">
        <img
          src={Illustration}
          alt="Assessment Illustration"
          className="w-80 h-80 object-contain transition-all duration-300"
        />
      </div>

      {/* Right Side - Component */}
      <div className="right-side flex flex-col justify-between items-center w-[40%] max-w-[500px] bg-white rounded-lg p-8 shadow-lg">
        <div className="component-container w-full flex-grow">
          {CurrentComponent}
        </div>

        <div className="navigation-buttons flex justify-between mt-6 w-full">
  {isSubmitted ? (
    <div className="w-full flex justify-center">
      <button
        onClick={() => window.location.href = '/'} // Redirect to home page
        className="w-1/4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Return to Home
      </button>
    </div>
  ) : (
    <>
      <button
        onClick={handleBack}
        className={`w-1/4 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentIndex === 0} // Disable Back button on first page
      >
        Back
      </button>

      {currentIndex < assessmentData.length - 1 ? (
        <button
          onClick={handleNext}
          className="w-1/4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Next
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="w-1/4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Submit
        </button>
      )}
    </>
  )}
</div>
      </div>
    </div> 
  ); 
}; 
 
export default AssessmentPage;
