import React from 'react';

export const NewExercise = ({ exerciseName,setExerciseName, exerciseType,setExerciseType }) => {
  return (
    <form className="p-4 bg-white rounded-lg shadow-md w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="exerciseName" className="block text-gray-700 mb-1">Exercise Name</label>
        <input
          type="text"
          id="exerciseName"
          placeholder="Enter exercise name"
          onChange={(e) => setExerciseName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={exerciseName}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="exerciseType" className="block text-gray-700 mb-1">Exercise Type</label>
        <select
          id="exerciseType"
          onChange={(e) => setExerciseType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={exerciseType}
          defaultValue=""
        >
          <option value="">-- Select Exercise Type --</option>
          <option value="weightlifting">Weightlifting</option>
          <option value="cardio">Cardio</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </div>
    </form>
  );
};
