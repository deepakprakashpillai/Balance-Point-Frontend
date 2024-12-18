import React, { useEffect } from 'react';
import DietStats from '../components/DietStats';
import Gauge from '../components/Gauge';
import { Carousel } from 'antd';
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';

export const ProfilePage = () => {

  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const assessmentData = useSelector((state) => state.user.assessmentData)
  console.log(userData.username)
  console.log(assessmentData)
  useEffect(()=>{
    (!userData.id) && (dispatch(fetchUserData()))
  },[])


  const moodData = {
    "productive": "💪",
    "energetic": "⚡",
    "happy": "😊",
    "motivated": "🚀",
    "content": "😌",
    "relaxed": "🧘‍♂️",
    "accomplished": "🏆",
    "tired": "😴",
    "stressed": "😓",
    "anxious": "😟"
  };

  const sleepEmojis = {
    1: "😴", // Very Poor Sleep
    2: "😕", // Poor Sleep
    3: "🙂", // Average Sleep
    4: "😊", // Good Sleep
    5: "🌟"  // Excellent Sleep
  };

  
  const mostLoggedMood = "relaxed";
  const sleepQuality = 5;
  const favoriteFood = 'Sushi'
  const average_calorie_intake = 2000;
  const calories_needed_for_goal = 1800;

  if (!userData.is_assessment_completed) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Please complete your assessment to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-100 min-h-screen"> 

      {/* Profile Details Section */}
      <div className="col-span-2 row-span-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6 pl-8 rounded-lg shadow-lg flex flex-col justify-between space-y-2">
  <div>
    <h2 className="text-2xl font-bold text-white">
      Hello, {userData.first_name} {userData.last_name}
    </h2>
    <p className="text-white text-sm mt-1">Your Profile Overview</p>
    <div className="mt-8 text-white space-y-2">
      
      <div className="flex items-center space-x-3">
        <i className="fas fa-envelope text-lg"></i>
        <p className="text-base"><strong>Email:</strong> {userData.email}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-user text-lg"></i>
        <p className="text-base"><strong>Username:</strong> {userData.username}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-calendar-alt text-lg"></i>
        <p className="text-base"><strong>Date Joined:</strong> {new Date(userData.date_joined).toLocaleDateString()}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-venus-mars text-lg"></i>
        <p className="text-base"><strong>Gender:</strong> {userData.gender}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-phone text-lg"></i>
        <p className="text-base"><strong>Phone:</strong> {userData.phone_number}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-birthday-cake text-lg"></i>
        <p className="text-base"><strong>Age:</strong> {userData.age}</p>
      </div>

      <div className="flex items-center space-x-3">
        <i className="fas fa-calendar text-lg"></i>
        <p className="text-base"><strong>DOB:</strong> {new Date(userData.dob).toLocaleDateString()}</p>
      </div>
    </div>
  </div>

  <div className="flex justify-center gap-3 mt-1">
    <button className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md transition duration-200 hover:scale-105 hover:bg-indigo-100 transform active:scale-95">
      Edit Profile
    </button>
    <button className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg shadow-md transition duration-200 hover:scale-105 hover:bg-indigo-100 transform active:scale-95">
      Redo Assessment
    </button>
  </div>
</div>

<div className="bg-gradient-to-r from-red-500 to-pink-500 col-span-2 p-6 rounded-lg shadow-md text-white flex items-center justify-start space-x-4 group">
  <span className="text-7xl ml-8 group-hover:scale-110 transition-transform duration-200">🔥</span>
  <div className="text-center ml-2"> 
    <p className="text-6xl font-extrabold mb-2 mt-8">15</p> 
    <p className="text-xl font-light ">days streak</p> 
  </div> 
</div>


      {/* Mood and Sleep Quality */}
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {/* Most Logged Mood */}
   <div className="bg-indigo-400 p-6 rounded-lg shadow-md text-white text-center group hover:cursor-pointer pt-12">
  <span className="text-7xl group-hover:scale-110 transform transition-all duration-200">{moodData[mostLoggedMood]}</span>
  <p className="text-xs font-light mt-3">Most Logged Mood</p>
  <p className="text-2xl font-bold mb-0">{mostLoggedMood.charAt(0).toUpperCase() + mostLoggedMood.slice(1)}</p> 
</div>


        {/* Average Sleep Quality */}
        <div className="bg-purple-400 p-6 rounded-lg shadow-md text-white text-center group hover:cursor-pointer pt-12">
      <span className="text-7xl group-hover:scale-110 transform transition-all duration-200">
        {sleepEmojis[sleepQuality]} {/* Render the emoji based on sleep quality */}
      </span>
      <p className="text-xs font-light mt-3">Average Sleep Quality</p>
      <p className="text-2xl font-bold mb-0">{sleepQuality} / 5</p> {/* Display the sleep quality value */}
    </div>
    </div>

      {/* Measurements and Statistics */}
      <div className="col-span-2 row-span-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-lg shadow-md text-white relative">
  <h2 className="text-lg font-bold mb-4">Measurements & Statistics</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {/* Left side: Gauge */}
    <div className="flex">
      <Gauge bmi={assessmentData.bmi} size={150} />
    </div>

    {/* Right side: Weight and Height Data */}
    <div className="space-y-2">
      {/* Current Weight */}
      <div className="flex justify-between items-center text-sm">
        <span>Current Weight</span>
        <span className="font-semibold">{assessmentData.weight} kg</span>
      </div>

      {/* Target Weight */}
      <div className="flex justify-between items-center text-sm">
        <span>Target Weight</span>
        <span className="font-semibold">{assessmentData.target_weight} kg</span>
      </div>

      {/* Weight to Lose or Gain */}
      <div className="flex justify-between items-center text-sm">
        <span>Weight to {assessmentData.weight > assessmentData.target_weight ? 'Lose' : 'Gain'}</span>
        <span className={`font-semibold ${assessmentData.weight > assessmentData.target_weight ? 'text-red-500' : 'text-green-500'}`}>
          {Math.abs(assessmentData.weight - assessmentData.target_weight)} kg
        </span>
      </div>

      {/* Height */}
      <div className="flex justify-between items-center text-sm">
        <span>Height</span>
        <span className="font-semibold">{assessmentData.height} cm</span>
      </div>
    </div>
  </div>

  {/* Edit Icon using Font Awesome */}
  <div className="absolute top-5 right-4 p-2 text-gray-200 cursor-pointer">
    <i className="fas fa-pen h-5 w-5"></i>
  </div>
</div>

      {/* Diet and Caloric Statistics */}
      <div className="col-span-2 row-span-2 bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-lg font-semibold">Diet & Statistics</h2>
        <DietStats rmr = {assessmentData.rmr} averageCalorieIntake = {average_calorie_intake} caloriesNeededForGoal={calories_needed_for_goal}/>
      </div>

      {/* Summary Stats Sections */}
  <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
  <p className="text-4xl mb-4 font-bold text-orange-600">{`40`}<span className="text-lg font-medium text-gray-500"> hrs</span></p>
  <h3 className="text-sm font-light text-gray-500">Workout Hours</h3>
</div>

<div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
  <p className="text-4xl mb-4 font-bold text-orange-600">{`120`}</p>
  <h3 className="text-sm font-light text-gray-500">Meals Logged</h3>
</div>

<div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
  <p className="text-4xl mb-4 font-bold text-orange-600">{`150`}<span className="text-lg font-medium text-gray-500"> hrs</span></p>
  <h3 className="text-sm font-light text-gray-500">Sleep Logged</h3>
</div>

<div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
  <p className="text-4xl mb-4 font-bold text-orange-600">{`50`}<span className="text-lg font-medium text-gray-500"> L</span></p>
  <h3 className="text-sm font-light text-gray-500">Water Drank</h3>
</div>

<div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
  <p className="text-4xl  mb-4 font-bold text-orange-600">{`25`}<span className="text-lg font-medium text-gray-500"> days</span></p>
  <h3 className="text-sm font-light text-gray-500">Diary Entries</h3>
</div>

      {/* Carousel for Favorite Workout and Food */}
      <div className="bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
      <div className="mt-2">
        <Carousel autoplay dots={false}>
        <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-light text-gray-800">Favorite Food</h3>
            <p className="text-xl font-bold text-orange-600 mt-0">{favoriteFood}</p>
          </div>

          {/* Favorite Exercise */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-light text-gray-800 ">Favorite Exercise</h3>
            <p className="text-xl font-bold text-orange-600 mt-0">Cricket</p>
          </div>
        </Carousel>
      </div>
    </div>
       
    </div> 
  ); 
};
