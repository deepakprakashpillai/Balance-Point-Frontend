import React from 'react';

export const NewFoodItem = ({ foodName,setFoodName, foodCalorie,setFoodCalorie }) => {
  return (
    <form className="p-4 bg-white rounded-lg shadow-md w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="foodName" className="block text-gray-700 mb-1">Food Name</label>
        <input
          type="text"
          id="foodName"
          placeholder="Enter food name"
          onChange={(e) => setFoodName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={foodName}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="foodCalorie" className="block text-gray-700 mb-1">Calorie per 100g</label>
        <input
        type="number"
          id="foodCalorie"
          onChange={(e) => setFoodCalorie(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={foodCalorie}
        />

      </div>
    </form>
  );
};
