import {React,useEffect,useState} from 'react';
import { FaRunning, FaDumbbell, FaBasketballBall, FaHandRock,FaHiking } from "react-icons/fa";
import {PieChartComponent} from '../components/PieChartComponent';
import { Carousel } from 'antd';
import MoodGraph from '../components/MoodGraph';
import WeeklyConsistencyCalendar from '../components/WeeklyConsistencyCalender';
import { NewWorkoutForm } from '../components/NewWorkoutForm';
import { Button, Modal } from 'antd';
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';
import axios from 'axios';

export const ExercisePage = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [adding, setAdding] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [workoutExperience, setWorkoutExperience] = useState(null)
  const [workoutExercises,setWorkoutExercises] = useState([])

  const handleOk = () => {
    setConfirmLoading(true);
    const postData = async()=>{
      const sessionData = {
        user: userData.id,
        feelings: workoutExperience,
        workout_exercises: workoutExercises,
      };
      const response = await axios.post("http://127.0.0.1:8000/workout-session/",sessionData)
      console.log(response.data)
    }
    postData();
    setWorkoutExperience(null)
    setWorkoutExercises([])
     // Log or submit the session data
    setAdding(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setAdding(false);
    console.log(adding)
  };

  const [previousWorkouts,setPreviousWorkouts] = useState([])
  const [weeklyExercises, setWeeklyExercises] = useState(0)
  const [monthlyExercises, setMonthlyExercises] = useState(0)
  const [mostRepeatedWorkouts,setMostRepeatedWorkouts] = useState({weightlifting: { workout: '', count: 0 },
  cardio: { workout: '', count: 0 },
  sports: { workout: '', count: 0 },
  other: { workout: '', count: 0 },
  })
  const [totalWorkoutCount,setTotalWorkoutCount] = useState({weightlifting: 0,
    cardio: 0,
    sports: 0,
    other: 0,
  })
  const [totalWorkoutIntensityCount,setTotalWorkoutIntensityCount] = useState({high:0,medium:0,low:0})
  const [dailyMood,setDailyMood] = useState([])

  
  useEffect(() =>{
    if (!userData.id) {
      dispatch(fetchUserData());
    }
  },[])
  useEffect(() => {
    const getWorkoutData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/workout-session/user/${userData.id}`);
        setPreviousWorkouts(response.data);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    if (userData.id) {
      getWorkoutData();
    }
  },[adding,userData])
  useEffect(() => {
    
    const getWorkoutCounts = () => {
      const today = new Date();
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(today);
      thisMonthStart.setDate(1);
    
      let weeklyExercises = 0;
      let monthlyExercises = 0;
      const workoutTypeCounts = { weightlifting: 0, cardio: 0, sports: 0, other: 0 };
      const workoutIntensityCounts = { high: 0, medium: 0, low: 0 };
    
      previousWorkouts.forEach((workout) => {
        const workoutDate = new Date(workout.date);
    
        // Count weekly and monthly exercises
        if (workoutDate >= thisWeekStart) {
          weeklyExercises += 1;
        }
        if (workoutDate >= thisMonthStart) {
          monthlyExercises += 1;
        }
    
        // Count total workouts by type
        workout.workout_exercises.forEach((exercise) => {
          const type = exercise.exercise.type;
          if (workoutTypeCounts[type] !== undefined) {
            workoutTypeCounts[type] += 1;
          }
    
          // Count intensity of workouts
          const intensity = exercise.intensity.toLowerCase();
          if (workoutIntensityCounts[intensity] !== undefined) {
            workoutIntensityCounts[intensity] += 1;
          }
        });
      });
    
      // Set the counts to the state
      setWeeklyExercises(weeklyExercises);
      setMonthlyExercises(monthlyExercises);
      setTotalWorkoutCount(workoutTypeCounts);
      setTotalWorkoutIntensityCount(workoutIntensityCounts);  // Update intensity counts
    };
    

const calculateMostRepeatedWorkouts = () => {
  const workoutCounts = {};

  previousWorkouts.forEach((session) => {
    session.workout_exercises.forEach((exercise) => {
      const { name, type } = exercise.exercise;

      if (!workoutCounts[type]) {
        workoutCounts[type] = {};
      }

      // Initialize or increment count for each workout
      workoutCounts[type][name] = (workoutCounts[type][name] || 0) + 1;
    });
  });

  const mostRepeatedWorkouts = {
    weightlifting: { workout: '', count: 0 },
    cardio: { workout: '', count: 0 },
    sports: { workout: '', count: 0 },
    other: { workout: '', count: 0 },
  };

  Object.keys(workoutCounts).forEach((type) => {
    let maxWorkout = '';
    let maxCount = 0;

    // Find the most repeated workout for each type
    Object.entries(workoutCounts[type]).forEach(([name, count]) => {
      if (count > maxCount) {
        maxWorkout = name;
        maxCount = count;
      }
    });

    if (mostRepeatedWorkouts[type]) {
      mostRepeatedWorkouts[type] = { workout: maxWorkout, count: maxCount };
    }
  });

  setMostRepeatedWorkouts(mostRepeatedWorkouts)
};

const calculateDailyMood = () => {
  const moodMap = {};

  previousWorkouts.forEach((workout) => {
    const workoutDate = new Date(workout.date).toISOString().split('T')[0];

    if (!moodMap[workoutDate] || new Date(workout.date) > new Date(moodMap[workoutDate].date)) {
      moodMap[workoutDate] = {
        mood: workout.feelings, // Use the latest workout's mood
        date: workout.date,     // Store the latest workout's date for comparison
      };
    }
  });

  const dailyMoods = Object.keys(moodMap).map((date) => ({
    date,
    mood: moodMap[date].mood,
  }));

  setDailyMood(dailyMoods);
};


calculateMostRepeatedWorkouts();

getWorkoutCounts();

calculateDailyMood();
  }, [previousWorkouts]);

  const activeDays = ['Mon', 'Wed', 'Thu', 'Sat'];
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-4 p-6">
      {/* Log New Workout */}
      <button 
        className="col-span-2 bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 font-semibold rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
        onClick={()=>setAdding(true)}  
      >
        
        <i className="fas fa-plus-circle text-6xl mb-4"></i>
        <h3 className="text-md font-light text-center">New Workout</h3>
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
        <NewWorkoutForm workoutExercises = {workoutExercises} setWorkoutExercises = {setWorkoutExercises} setWorkoutExperience = {setWorkoutExperience} workoutExperience = {workoutExperience}/>
      </Modal>

      


      {/* Previous Workouts */}
      <div className="col-span-4 row-span-2 bg-gradient-to-br from-red-50 to-red-100 text-red-900 font-semibold rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-xl font-semibold mb-8">Previous Workouts</h3>  

  <div className="flex gap-5 overflow-x-auto scroll-smooth">  
    {previousWorkouts.slice().reverse().map((workout) => (  
      <div
      key={workout.id}
      className="bg-white text-red-800 p-4 mb-2 rounded-lg w-96 transition-colors duration-300 hover:bg-gradient-to-br from-red-100 to-red-200 min-w-52 no-scrollbar"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col items-center pl-3">
          <span className="text-4xl mb-0 ">
            {workout.feelings === 'happy' && <span role="img" aria-label="happy">😊</span>}
            {workout.feelings === 'calm' && <span role="img" aria-label="calm">😌</span>}
            {workout.feelings === 'tired' && <span role="img" aria-label="tired">😴</span>}
            {workout.feelings === 'stressed' && <span role="img" aria-label="stressed">😓</span>}
            {workout.feelings === 'energized' && <span role="img" aria-label="energized">⚡</span>}
            {workout.feelings === 'unhappy' && <span role="img" aria-label="unhappy">☹️</span>}
          </span>
          <p className="text-xs text-gray-600 font-light">
            {workout.feelings.charAt(0).toUpperCase() + workout.feelings.slice(1)}
          </p>
        </div>
    
        <div className="text-right text-xs pr-3 mb-0">
          <p className="font-medium">{new Date(workout.date).toLocaleDateString()}</p>
          {workout.workout_exercises[0].exercise.type !== 'weightlifting' && (
            <p className="text-gray-500 text-lg">{workout.total_duration} mins</p>
          )}
        </div>
      </div>
    
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 mb-4">Exercises:</p>
        {workout.workout_exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-red-50 text-red-800 p-2 rounded-lg shadow-sm flex flex-col gap-1 transition-colors duration-300 hover:bg-red-100"
          >
            <p className="font-semibold text-sm uppercase mb-1">{exercise.exercise.name}</p>
    
            <div className="flex justify-between text-xs ">
              {/* Cardio Type: Show intensity, distance, and duration */}
              {exercise.exercise.type === 'cardio' && (
                <>
                  <div className="text-center">
                    <p className="text-lg font-md uppercase mb-1">{exercise.intensity}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">Intensity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.distance || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.duration || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">mins</p>
                  </div>
                </>
              )}
    
              {/* Weightlifting Type: Show sets, reps, and weight */}
              {exercise.exercise.type === 'weightlifting' && (
                <>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.sets || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">Sets</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.reps || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">Reps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.weight || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">kg</p>
                  </div>
                </>
              )}
    
              {/* Sports and Other Types: Show intensity and duration */}
              {(exercise.exercise.type === 'sports' || exercise.exercise.type === 'other') && (
                <>
                  <div className="text-center">
                    <p className="text-lg font-semibold uppercase mb-1">{exercise.intensity}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">Intensity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">{exercise.duration || '-'}</p>
                    <p className="text-gray-500 text-xs font-light mb-1">mins</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    
     
    ))} 
  </div> 
</div> 







      
      {/* Most Repeated Exercises */}
      <div className="col-span-2 row-span-2 bg-gray-50 text-gray-800 font-semibold rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 space-y-4"> 
  <h3 className="text-lg mb-4 text-center">Most Repeated Exercises</h3> 

  <div className="bg-yellow-100 flex items-center justify-center text-center gap-4 p-4 py-2 pr-12 rounded-lg shadow hover:shadow-md transition-shadow">
    <FaDumbbell className="text-3xl text-yellow-600 mr-4" />
    <div className="text-left">
      <p className="text-base font-semibold">Weightlifting</p>
      <p className="text-sm font-medium text-yellow-700">
        {mostRepeatedWorkouts.weightlifting.workout || 'No workout'} - {mostRepeatedWorkouts.weightlifting.count} times
      </p>
    </div>
  </div>

  <div className="bg-blue-100 flex items-center justify-center text-center gap-4 p-4 py-2 pr-12 rounded-lg shadow hover:shadow-md transition-shadow">
    <FaRunning className="text-3xl text-blue-600 mr-4" />
    <div className="text-left">
      <p className="text-base font-semibold">Cardio</p>
      <p className="text-sm font-medium text-blue-700">
        {mostRepeatedWorkouts.cardio.workout || 'No workout'} - {mostRepeatedWorkouts.cardio.count} times
      </p>
    </div>
  </div>

  <div className="bg-green-100 flex items-center justify-center text-center gap-4 p-4 py-2 pr-12 rounded-lg shadow hover:shadow-md transition-shadow">
    <FaBasketballBall className="text-3xl text-green-600 mr-4" />
    <div className="text-left">
      <p className="text-base font-semibold">Sports</p>
      <p className="text-sm font-medium text-green-700">
        {mostRepeatedWorkouts.sports.workout || 'No workout'} - {mostRepeatedWorkouts.sports.count } times
      </p>
    </div>
  </div>

  <div className="bg-purple-100 flex items-center justify-center text-center gap-4 p-4 py-2 pr-12 rounded-lg shadow hover:shadow-md transition-shadow">
    <FaHiking className="text-3xl text-purple-600 mr-4" />
    <div className="text-left">
      <p className="text-base font-semibold">Other</p>
      <p className="text-sm font-medium text-purple-700">
        {mostRepeatedWorkouts.other.workout || 'No workout'} - {mostRepeatedWorkouts.other.count} times
      </p>
    </div>
  </div>   
</div>








      
      {/* Total Exercises This Week and Month */}
      <div className="col-span-2 bg-gradient-to-br from-green-600 to-green-400 text-green-900 font-semibold rounded-lg shadow-lg p-6 py-1 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-center">
      <h3 className="text-2xl font-light text-green-100">You Worked Out</h3>

      <div className="grid grid-cols-3 items-center gap-6 text-center">
        {/* Achievement Emoji */}
        <div className="col-span-1 flex justify-center">
          <span className="text-6xl text-green-100">🏆</span>
        </div>

        {/* Weekly and Monthly Exercise Stats */}
        <div className="col-span-2 flex justify-center gap-10">
          {/* Weekly Exercises */}
          <div>
            <p className="text-5xl font-extrabold text-green-100 leading-tight mb-2">{weeklyExercises}</p>
            <p className="text-base font-light text-green-200 mb-1">This Week</p>
          </div>

          {/* Monthly Exercises */}
          <div>
            <p className="text-5xl font-extrabold text-green-100 leading-tight mb-2">{monthlyExercises}</p>
            <p className="text-base font-light text-green-200 mb-1">This Month</p>
          </div>
        </div>
      </div>
    </div>








      
      {/* Mood Over Time */}
      <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-100 to-blue-300 text-gray-900 font-semibold rounded-lg shadow-lg p-4 pl-0 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg font-bold text-center mb-16">Mood Over Time</h3>

      {/* Calling the MoodGraph component */}
      <MoodGraph dailyMood={dailyMood}/>


    </div>








      
      {/* Exercise Intensity */}
      <div className="col-span-2 bg-gradient-to-br from-purple-50 to-purple-200 text-purple-900 font-semibold rounded-lg shadow-lg p-6 pb-2 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-lg">Intensity Breakdown</h3>
        <PieChartComponent totalWorkoutIntensityCount={totalWorkoutIntensityCount}/>
</div>









      
      {/* Diversity Breakdown */}
      <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 font-semibold rounded-lg shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 space-y-4">
  <h3 className="text-lg mb-3">Exercise Diversity</h3> 

  {/* Weightlifting */} 
  <div className="bg-white p-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1"> 
    <p className="text-sm font-semibold mb-2">Weightlifting</p>
    <div className="flex items-center gap-2">
      <div className="flex-grow bg-gray-300 h-6 rounded-lg overflow-hidden">
        <div className="bg-purple-700 h-full" style={{ width: `${(totalWorkoutCount.weightlifting / (totalWorkoutCount.weightlifting + totalWorkoutCount.cardio + totalWorkoutCount.sports + totalWorkoutCount.other)) * 100}%` }}></div>
      </div>
      <span className="text-lg font-bold">{totalWorkoutCount.weightlifting} sessions</span>
    </div>
  </div>

  {/* Cardio */}
  <div className="bg-white p-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1">
    <p className="text-sm font-semibold">Cardio</p>
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-grow bg-gray-300 h-6 rounded-lg overflow-hidden">
        <div className="bg-purple-700 h-full" style={{ width: `${(totalWorkoutCount.cardio / (totalWorkoutCount.weightlifting + totalWorkoutCount.cardio + totalWorkoutCount.sports + totalWorkoutCount.other)) * 100}%` }}></div>
      </div>
      <span className="text-lg font-bold">{totalWorkoutCount.cardio} sessions</span>
    </div>
  </div>

  {/* Sports */}
  <div className="bg-white p-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1">
    <p className="text-sm font-semibold">Sports</p>
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-grow bg-gray-300 h-6 rounded-lg overflow-hidden">
        <div className="bg-purple-700 h-full" style={{ width: `${(totalWorkoutCount.sports / (totalWorkoutCount.weightlifting + totalWorkoutCount.cardio + totalWorkoutCount.sports + totalWorkoutCount.other)) * 100}%` }}></div>
      </div>
      <span className="text-lg font-bold">{totalWorkoutCount.sports} sessions</span>
    </div>
  </div>

  {/* Others */}
  <div className="bg-white p-4 py-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 transform hover:-translate-y-1">
    <p className="text-sm font-semibold">Others</p>
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-grow bg-gray-300 h-6 rounded-lg overflow-hidden">
        <div className="bg-purple-700 h-full" style={{ width: `${(totalWorkoutCount.other / (totalWorkoutCount.weightlifting + totalWorkoutCount.cardio + totalWorkoutCount.sports + totalWorkoutCount.other)) * 100}%` }}></div>
      </div>
      <span className="text-lg font-bold">{totalWorkoutCount.other} sessions</span>
    </div> 
  </div>  
</div>









      
      {/* Personal Records */}
      <div className="col-span-2 bg-gradient-to-br from-orange-100 to-orange-300 text-orange-900 font-semibold rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
  <h3 className="text-xl font-bold text-center mb-2">Personal Records</h3>

  <Carousel autoplay dots={false} className="custom-carousel">
    {/* Weightlifting Card */}
    <div className="flex items-center justify-between bg-transparent transition-all duration-300">
  {/* Left side: Content */}
  <div className="flex flex-col space-y-1 text-center">
    <h4 className="text-lg font-medium text-gray-700">Weightlifting </h4> {/* Heading */}
    <div className="flex flex-col items-center">
      <p className="text-5xl font-bold text-orange-600 mb-8">1000</p> {/* Main number */}
      <p className="text-sm font-medium text-gray-600">kg volume</p> {/* Subtext */}
    </div>
  </div>
</div>






   {/* Cardio Card */}
<div className="flex items-center justify-between bg-transparent rounded-xl transition-all duration-300">
  {/* Left side: Content */}
  <div className="flex flex-col space-y-1 text-center">
    <h4 className="text-lg font-medium text-gray-700">Cardio</h4> {/* Heading */}
    <div className="flex flex-col items-center">
      <p className="text-5xl font-bold text-orange-600 mb-8">20</p> {/* Main number */}
      <p className="text-sm font-medium text-gray-600">km in 5 minutes</p> {/* Subtext */}
    </div>
  </div>
</div>

{/* Sports Card */}
<div className="flex items-center justify-between bg-transparent rounded-xl transition-all duration-300">
  {/* Left side: Content */}
  <div className="flex flex-col space-y-1 text-center">
    <h4 className="text-lg font-medium text-gray-700">Sports</h4> {/* Heading */}
    <div className="flex flex-col items-center">
      <p className="text-5xl font-bold text-orange-600 mb-8">1</p> {/* Main number */}
      <p className="text-sm font-medium text-gray-600">hour</p> {/* Subtext */}
    </div>
  </div>
</div>

  </Carousel>
</div>







      
      
      {/* Weekly Consistency */}
      <div className="col-span-2 bg-gradient-to-br from-yellow-100 to-orange-200 text-yellow-900 font-semibold rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
  <h3 className="text-xl font-bold text-center mb-12">Weekly Consistency</h3>
  <WeeklyConsistencyCalendar activeDays={activeDays} />
</div>





    </div>
  );
};
