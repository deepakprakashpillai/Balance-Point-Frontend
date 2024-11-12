import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import {useDispatch, useSelector } from 'react-redux';
import { NewExercise } from './NewExercise';
import axios from 'axios';

export const NewWorkoutForm = ({workoutExercises,setWorkoutExercises,setWorkoutExperience,workoutExperience}) => {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [intensity, setIntensity] = useState('');
  const [additionalData, setAdditionalData] = useState({});
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState(null);
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [adding, setAdding] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);


  const [allExercises,setAllExercises ]= useState([])

  const workoutExperienceOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'unhappy', emoji: '😞', label: 'Unhappy' },
    { value: 'energized', emoji: '💪', label: 'Energized' },
    { value: 'tired', emoji: '😫', label: 'Tired' },
    { value: 'stressed', emoji: '😣', label: 'Stressed' },
  ];

  const handleAddNewWorkout = () => {
    if (selectedExercise && intensity && additionalData) {
      const exercise = {
        exercise: parseInt(selectedExercise),
        intensity,
        ...additionalData,
      };
      setWorkoutExercises([...workoutExercises, exercise]);
      setSelectedExercise('');
      setIntensity('');
      setAdditionalData({});
    }
  };

  const handleRemoveExercise = (index) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const handleOk = () => {
    setConfirmLoading(true);
    const postData = async()=>{
      const exerciseData = {
        added_by: userData.id,
        name:exerciseName,
        type:exerciseType,
      };
      console.log(exerciseData)
      const response = await axios.post("http://127.0.0.1:8000/exercise/",exerciseData)
      console.log(response.data)
      setAllExercises([...allExercises,response.data])
    }
    postData();
    setExerciseType(null)
    setExerciseName('')
    setAdding(false);
    setConfirmLoading(false);
  };
  const handleCancel = () => {
    setAdding(false);
    console.log(adding)
  };

  useEffect(()=>{
    const fetchData = async() =>{
      try{
        const response = await axios.get(`http://127.0.0.1:8000/exercises/${userData.id}`);
        setAllExercises(response.data)
      }
      catch(error){
        console.error("Fetching exercises failed:", error);
      }
    }
    fetchData();
    
  },[adding])

  return (
    <form className="grid grid-cols-5 gap-4 w-[950px]">
      <div className="col-span-5">
          <label className="block text-gray-700 mb-1">How was your workout?</label>
          <div className="flex justify-around">
            {workoutExperienceOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setWorkoutExperience(option.value)}
                className={`flex flex-col items-center cursor-pointer transition duration-200 transform ${
                  workoutExperience === option.value
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-500 scale-105'
                    : 'text-gray-400'
                } hover:scale-110 p-2 rounded-lg`}
              >
                <span className="text-5xl">{option.emoji}</span>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      <div className="col-span-3">
        {/* Workout Experience Section */}
        

        {/* Exercise Selection and Intensity */}
        <div className="mt-4">
  <label htmlFor="exercise" className="block text-gray-700 mb-1">Select Exercise</label>
  <div className="flex items-center space-x-2">
    <select
      id="exercise"
      value={selectedExercise}
      onChange={(e) => setSelectedExercise(e.target.value)}
      className="w-3/4 p-2 border border-gray-300 rounded-lg mb-2"
    >
      <option value="">-- Select an Exercise --</option>
      {allExercises.map((exercise) => (
        <option key={exercise.id} value={exercise.id}>
          {exercise.name} - {exercise.type}
        </option>
      ))}
    </select>
    <button
      type="button"
      onClick={()=>{setAdding(true)}}
      className="p-2 bg-green-500 text-white rounded-lg w-1/4 mb-2"
    >
      New
    </button>
    <Modal
        title="Add new Exercise"
        open={adding}
        onOk={handleOk} 
        onCancel={()=>{
          setAdding(false)
          console.log(adding)
        }}
        confirmLoading={confirmLoading}
        okText="Add"
      >
        <NewExercise exerciseName = {exerciseName} setExerciseName={setExerciseName} exerciseType={exerciseType} setExerciseType={setExerciseType} />
      </Modal>
  </div>


          <label className="block text-gray-700 mb-1">Intensity</label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select Intensity --</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Dynamic Inputs Based on Exercise Type */}
        <div className="mt-4">
          {selectedExercise && allExercises.find((ex) => ex.id === parseInt(selectedExercise)).type === 'weightlifting' && (
            <>
              <label className="block text-gray-700 mb-1">Reps</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Enter reps"
                onChange={(e) => setAdditionalData({ ...additionalData, reps: e.target.value })}
              />
              <label className="block text-gray-700 mb-1">Sets</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Enter sets"
                onChange={(e) => setAdditionalData({ ...additionalData, sets: e.target.value })}
              />
              <label className="block text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter weight"
                onChange={(e) => setAdditionalData({ ...additionalData, weight: e.target.value })}
              />
            </>
          )}
          {/* Dynamic Inputs for Cardio */}
{selectedExercise && allExercises.find((ex) => ex.id === parseInt(selectedExercise)).type === 'cardio' && (
  <>
    <label className="block text-gray-700 mb-1">Distance (km)</label>
    <input
      type="number"
      className="w-full p-2 border border-gray-300 rounded-lg mb-2"
      placeholder="Enter distance"
      onChange={(e) => setAdditionalData({ ...additionalData, distance: e.target.value })}
    />
    <label className="block text-gray-700 mb-1">Duration (minutes)</label>
    <input
      type="number"
      className="w-full p-2 border border-gray-300 rounded-lg"
      placeholder="Enter duration"
      onChange={(e) => setAdditionalData({ ...additionalData, duration: e.target.value })}
    />
  </>
)}

{/* Dynamic Inputs for Sports and Other */}
{selectedExercise && (allExercises.find((ex) => ex.id === parseInt(selectedExercise)).type === 'sports' ||
  allExercises.find((ex) => ex.id === parseInt(selectedExercise)).type === 'other') && (
    <>
      <label className="block text-gray-700 mb-1">Duration (minutes)</label>
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter duration"
        onChange={(e) => setAdditionalData({ ...additionalData, duration: e.target.value })}
      />
    </>
)}

        </div>

        <button type="button" onClick={handleAddNewWorkout} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">
          Add Exercise
        </button>

      </div>

      {/* Workout List on Right Side: */}
      <div className="col-span-2 bg-gray-100 p-4 rounded-lg w-full">
  <h3 className="text-lg font-bold mb-2">Added Exercises</h3>
  <ul>
    {workoutExercises.map((exercise, index) => {
      // Find the exercise name and type by matching the ID
      const exerciseDetails = allExercises.find((ex) => ex.id === parseInt(exercise.exercise));

      return (
        <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-800">{exerciseDetails.name}</h4>
            <p className="text-sm text-gray-600">
              {/* Display different details based on the exercise type */}
              {exerciseDetails.type === 'weightlifting' &&
                `${exercise.weight}kg - ${exercise.sets} x ${exercise.reps} sets`}
              {exerciseDetails.type === 'cardio' &&
                `${exercise.distance} km in ${exercise.duration} minutes`}
              {(exerciseDetails.type === 'sports' || exerciseDetails.type === 'other') &&
                `${exercise.duration} minutes`}
            </p>
            <p className="text-sm text-blue-500 font-medium mt-1">{`Intensity: ${exercise.intensity}`}</p>
          </div>
          <button
            onClick={() => handleRemoveExercise(index)}
            className="text-red-500 hover:underline ml-4"
          >
            Remove
          </button>
        </li>
      );
    })}
  </ul>
</div>

    </form>
  );
};
