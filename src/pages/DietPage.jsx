import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { FaUtensils } from 'react-icons/fa';
import { CircularProgress, Typography, Box } from '@mui/material';
import CalorieGraph from '../components/CalorieGraph';
import { PieChartDietComponent } from '../components/PieChartDietComponent';
import { NewDietForm } from '../components/NewDietForm';
import { Modal } from 'antd';
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';
import axios from 'axios';

export const DietPage = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [dietData, setDietData] = useState([]);
  const [dailyCalorieSummary, setDailyCalorieSummary] = useState([])
  const [mealExperienceData, setMealExperienceData] = useState([])
  const [favoriteFoods, setFavoriteFoods] = useState([])
  const [todayDietData, setTodayDietData] = useState({
    totalCalories: 0,
    mealExperience: '-',
  })
  const [totalMealExperienceData, setTotalMealExperienceData] = useState({})
  const [foodServings, setFoodServings] = useState([])
  const  [mealExperience,setMealExperience] = useState(null)
  
  const [adding, setAdding] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    const postData = async()=>{
    const sessionData = {
      user: userData.id,
      meal_experience: mealExperience,
      food_servings: foodServings,
    };
    const response = await axios.post("http://127.0.0.1:8000/meals/",sessionData)
      console.log(response.data)
    }
    postData();
    setMealExperience(null)
    setFoodServings([])
    setAdding(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setAdding(false);
    console.log(adding)
  };
  
  useEffect(()=>{
    if(!userData.id){
      dispatch(fetchUserData())
    }
  },[])

  useEffect(()=>{
    const getDietData = async() => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/meals/user/${userData.id}`);
        setDietData(response.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    if (userData.id){
      getDietData();
    }
  },[userData,adding])

  useEffect(() => {
    const processDietData = (dietData) => {
      const dailyCalorieSummary = [];
      const mealExperienceData = [];
      const favoriteFoodsCount = {};
  
      const experienceScores = {
        Happy: 5,
        Energized: 4,
        Calm: 3,
        Tired: 2,
        Stressed: 1,
        Unhappy: 0,
      };
  
      // Create an object that maps scores to experiences (only valid experiences)
      const scoreToExperience = {
        5: 'Happy',
        4: 'Energized',
        3: 'Calm',
        2: 'Tired',
        1: 'Stressed',
        0: 'Unhappy',
      };
  
      const experienceAccumulator = {};
      const totalMealExperienceData = { total: 0 };
  
      Object.keys(experienceScores).forEach(experience => {
        totalMealExperienceData[experience] = 0;
      });
  
      dietData.forEach((meal) => {
        const date = new Date(meal.date_time).toLocaleDateString();
  
        // 1. Daily Calorie Summary with Multiple Meals
        const existingDateEntry = dailyCalorieSummary.find(entry => entry.date === date);
        if (existingDateEntry) {
          existingDateEntry.calories += meal.total_calories;
        } else {
          dailyCalorieSummary.push({ date, calories: meal.total_calories });
        }
  
        // 2. Meal Experience Data - Calculate Average Experience per Day
        if (!experienceAccumulator[date]) {
          experienceAccumulator[date] = { totalScore: 0, count: 0 };
        }
  
        const experienceScore = experienceScores[meal.meal_experience] || 3; // Default to Calm if experience not found
        experienceAccumulator[date].totalScore += experienceScore;
        experienceAccumulator[date].count += 1;
  
        // 3. Favorite Foods Count
        meal.food_servings.forEach((serving) => {
          const foodName = serving.food_item.name;
          favoriteFoodsCount[foodName] = (favoriteFoodsCount[foodName] || 0) + 1;
        });
  
        // 4. Track total experiences across all meals
        const experience = meal.meal_experience;
        if (totalMealExperienceData[experience] !== undefined) {
          totalMealExperienceData[experience] += 1;
        }
        totalMealExperienceData.total += 1;
      });
  
      // Convert accumulated experience scores into averages and push to mealExperienceData
      for (const [date, { totalScore, count }] of Object.entries(experienceAccumulator)) {
        const averageScore = totalScore / count;
        const ceilingScore = Math.ceil(averageScore); // Use Math.ceil() to round up the average score
        const experience = scoreToExperience[ceilingScore]; // Use the ceiling score to map to the experience
        mealExperienceData.push({ date, experience });
      }
  
      const favoriteFoods = Object.entries(favoriteFoodsCount).map(([name, count]) => ({
        name,
        count,
      }));
  
      return { dailyCalorieSummary, mealExperienceData, favoriteFoods, totalMealExperienceData };
    };
  
    // Ensure dietData is valid before processing
    if (dietData && dietData.length > 0) {
      const { dailyCalorieSummary, mealExperienceData, favoriteFoods, totalMealExperienceData } = processDietData(dietData);
  
      setDailyCalorieSummary(dailyCalorieSummary);
      setMealExperienceData(mealExperienceData);
      setFavoriteFoods(favoriteFoods);
      setTotalMealExperienceData(totalMealExperienceData);
    }
  }, [dietData]);
  
  useEffect(() => {
    const getTodaysDietData = () => {
      const todayDate = new Date().toLocaleDateString('en-US');
      console.log('Today Date :', todayDate);

      const todayCalorieEntry = dailyCalorieSummary.find(entry => entry.date === todayDate);
      const todayExperienceEntry = mealExperienceData.find(entry => entry.date === todayDate);

      const totalCalories = todayCalorieEntry ? todayCalorieEntry.calories : 0;
      const mealExperience = todayExperienceEntry ? todayExperienceEntry.experience : '-';

      setTodayDietData({ totalCalories, mealExperience });
    };

    if (dailyCalorieSummary.length > 0 && mealExperienceData.length > 0) {
      getTodaysDietData();
    }
    console.log(todayDietData)
  }, [dailyCalorieSummary, mealExperienceData]);  
  
  
  
  

  return (
    <div className="p-6 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">



      <button className="col-span-3 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 font-semibold rounded-lg shadow-lg p-6 flex items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer transform h-24"
      onClick={()=>setAdding(true)}>
      <i className="fas fa-plus-circle text-4xl mr-5"></i>
        <h3 className="text-md font-light text-center">New Meal</h3>
        </button>
        <Modal
        title="Add new Workout Session"
        open={adding}
        onOk={handleOk} 
        onCancel={()=>{
          setAdding(false)
          console.log(adding)
        }}
        confirmLoading={confirmLoading}
        width={1000}
        okText="Log session"
      >
        <NewDietForm foodServings = {foodServings} setFoodServings={setFoodServings} setMealExperience={setMealExperience} mealExperience={mealExperience}/>
        </Modal>


{/* Today's Diet Overview */}
<div className="bg-white p-6 shadow-lg rounded-lg col-span-1 flex flex-col items-center"> 
  <h3 className="text-blue-600 text-lg font-semibold mb-4">Today's Diet Overview</h3> 
  
  <Box position="relative" display="inline-flex" className="mb-2">
    <CircularProgress
      variant="determinate"
      value={(todayDietData.totalCalories / 2000) * 100} // progress based on current vs target
      size={128}
      thickness={5}
      sx={{
        color: '#3b82f6',
        '& .MuiCircularProgress-circle': {
          strokeLinecap: 'round',
        },
      }}
    />
    <Box
      top={0}
      left={0}
      bottom={0}
      right={0}
      position="absolute"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" component="div" color="textPrimary" fontWeight="bold">
        {todayDietData.totalCalories}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        /2000
      </Typography>
    </Box>
  </Box>

  <Typography variant="caption" color="textSecondary">
    Calories Consumed Today
  </Typography>

  <div className="flex flex-col items-center mt-4">
  <p className="text-4xl mb-0">
      {todayDietData.mealExperience === 'Happy' ? '😊' :
       todayDietData.mealExperience === 'Calm' ? '😌' : 
       todayDietData.mealExperience === 'Tired' ? '😴 ' :
       todayDietData.mealExperience === 'Stressed' ? '😖' :
       todayDietData.mealExperience === 'Energized' ? '💪' :
       todayDietData.mealExperience === 'Unhappy' ? '😞' :
       '-'} {/* Default to dash if no experience */}
    </p>
  </div> 
</div>








          {/* Meal Experience Graph */}
          <div className="bg-white p-6 shadow-lg rounded-lg col-span-1">
            <h3 className="text-blue-600 text-lg font-semibold">Meal Experience</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
              <PieChartDietComponent totalMealExperienceData={totalMealExperienceData}/>
              </ResponsiveContainer>
            </div>
          </div>



          {/* Latest Entries */}
          <div className="col-span-1 row-span-2 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 font-semibold rounded-xl shadow-lg p-4 max-h-[700px] overflow-y-scroll scrollbar-hidden hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-lg font-semibold mb-4">Latest Entries</h3>

  <div className="space-y-6">
    {dietData.reverse().map((meal, mealIndex) => (
      <div key={meal.id} className="bg-white text-blue-800 p-4 rounded-lg shadow-sm">
        {/* Meal Header with Date and Experience */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-lg font-medium">{new Date(meal.date_time).toLocaleDateString()}</p>
            <p className="text-gray-600 text-sm">Experience: {meal.meal_experience}</p>
          </div>
          <p className="text-sm font-semibold text-blue-900">Total: {meal.total_calories} kcal</p>
        </div>

        {/* Food Servings within the Meal */}
        <div className="space-y-3">
          {meal.food_servings.map((serving) => {
            const totalServingCalories = (serving.quantity * serving.food_item.calories_per_100g) / 100;

            return (
              <div key={serving.id} className="bg-blue-50 p-2 rounded-lg shadow-inner">
                <div className="flex justify-between">
                  {/* Food Item, Quantity, and Calories */}
                  <div>
                    <p className="font-semibold">{serving.food_item.name}</p>
                    <p className="text-gray-600 text-sm">
                      {serving.quantity}g - {totalServingCalories.toFixed(0)} kcal
                    </p>
                  </div>
                  {/* Note */}
                  <div className="text-right text-xs text-gray-500 italic">
                    {serving.note && <p>{serving.note}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
</div>





          {/* Favorite Food Items */}
          

          <div className="bg-white p-6 pt-3 shadow-lg rounded-lg col-span-1">
  <h3 className="text-blue-600 text-lg font-semibold">Favorite Food Items</h3>

  {/* Ensure favoriteFoods is an array before sorting */}
  {Array.isArray(favoriteFoods) && favoriteFoods.length > 0 ? (
    favoriteFoods
      .sort((a, b) => b.count - a.count)  // Sorting in descending order
      .slice(0, 3) // Only take the top 3 items
      .map((food, index) => {
        // Use a color palette based on index to avoid hardcoding food names
        const colorClasses = [
          'bg-yellow-100 text-yellow-600',
          'bg-blue-100 text-blue-600',
          'bg-green-100 text-green-600',
          'bg-purple-100 text-purple-600',
          'bg-red-100 text-red-600',
        ];

        // Cycle through colors if there are more than 5 foods
        const colorClass = colorClasses[index % colorClasses.length];

        return (
          <div
            key={index}
            className={`flex items-center mt-4 justify-center text-center gap-4 p-4 pr-12 rounded-lg shadow hover:shadow-md transition-shadow ${colorClass}`}
          >
            <FaUtensils className="text-3xl mr-4" />
            <div className="text-left">
              <p className={`text-sm font-medium ${colorClass.split(' ')[1]}`}>{food.name} - {food.count} times</p>
            </div>
          </div>
        );
      })
  ) : (
    <p>No favorite foods to display.</p>
  )}
</div>





        

        

          {/* Weekly Calorie Summary */}
          <div className="bg-white p-6 pt-3 shadow-lg rounded-lg col-span-1">
            <h3 className="text-blue-600 text-lg font-semibold">Weekly Calorie Summary</h3>
            <CalorieGraph dailyCalorieSummary={dailyCalorieSummary}/>
          </div>
        
      </div>
  );
};

