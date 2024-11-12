import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Button, Modal } from 'antd';
import {useDispatch, useSelector } from 'react-redux';
import { NewFoodItem } from './NewFoodItem';
export const NewDietForm = ({ foodServings, setFoodServings, setMealExperience, mealExperience }) => {
  const [selectedFoodItem, setSelectedFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodCalorie, setFoodCalorie] = useState(0);
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [adding, setAdding] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
const [foodItems,setFoodItems] = useState([
    {
        "id": 1,
        "name": "Apple",
        "calories_per_100g": 52
    },
    {
        "id": 2,
        "name": "Orange",
        "calories_per_100g": 68
    },
    {
        "id": 3,
        "name": "Banana",
        "calories_per_100g": 68
    }
])
  const mealExperienceOptions = [
    { value: 'Happy', emoji: '😊', label: 'Happy' },
    { value: 'Calm', emoji: '😌', label: 'Calm' },
    { value: 'Unhappy', emoji: '😞', label: 'Unhappy' },
    { value: 'Energized', emoji: '💪', label: 'Energized' },
    { value: 'Tired', emoji: '😫', label: 'Tired' },
    { value: 'Stressed', emoji: '😣', label: 'Stressed' },
  ];

  const handleAddFoodServing = () => {
    if (selectedFoodItem && quantity && note) {
      const foodServing = {
        food_item: parseInt(selectedFoodItem),
        quantity: parseInt(quantity),
        note,
      };
      setFoodServings((prevServings) => [...prevServings, foodServing]);
      setSelectedFoodItem('');
      setQuantity('');
      setNote('');
    }
  };

  const handleRemoveFoodServing = (index) => {
    setFoodServings((prevServings) => prevServings.filter((_, i) => i !== index));
  };

  const handleOk = () => {
    setConfirmLoading(true);
    const postData = async()=>{
      const foodData = {
        added_by: userData.id,
        name:foodName,
        calories_per_100g:foodCalorie,
      };
      console.log(foodData)
      const response = await axios.post("http://127.0.0.1:8000/food-item/",foodData)
      console.log(response.data)
      setFoodItems([...foodItems,response.data])
    }
    postData();
    setFoodName('')
    setFoodCalorie(0)
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
        const response = await axios.get(`http://127.0.0.1:8000/food-items/${userData.id}`);
        setFoodItems(response.data)
      }
      catch(error){
        console.error("Fetching food items failed:", error);
      }
    }
    fetchData();
    
  },[adding])

  return (
    <form className="grid grid-cols-5 gap-4 w-[950px]">
      <div className="col-span-5">
        <label className="block text-gray-700 mb-1">How was your meal?</label>
        <div className="flex justify-around">
          {mealExperienceOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setMealExperience(option.value)}
              className={`flex flex-col items-center cursor-pointer transition duration-200 transform ${
                mealExperience === option.value
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

      {/* Food Selection and Quantity Section */}
      <div className="col-span-3 mt-4">
        <label htmlFor="foodItem" className="block text-gray-700 mb-1">Select Food Item</label>
        <div className="flex items-center space-x-2">
        <select
          id="foodItem"
          value={selectedFoodItem}
          onChange={(e) => setSelectedFoodItem(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 rounded-lg mb-2"
        >
          <option value="">-- Select a Food Item --</option>
          {foodItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
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
        title="Add new Food item"
        open={adding}
        onOk={handleOk} 
        onCancel={()=>{
          setAdding(false)
          console.log(adding)
        }}
        confirmLoading={confirmLoading}
        okText="Add"
      >
        <NewFoodItem foodName = {foodName} setFoodName={setFoodName} foodCalorie={foodCalorie} setFoodCalorie={setFoodCalorie} />
      </Modal>
  </div>


        <label className="block text-gray-700 mb-1">Quantity (g)</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
          placeholder="Enter quantity"
        />

        <label className="block text-gray-700 mb-1">Note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Enter a note (e.g., Tasty, Normal)"
        />

        <button type="button" onClick={handleAddFoodServing} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">
          Add Food Item
        </button>
      </div>

      {/* Food List on Right Side */}
      <div className="col-span-2 bg-gray-100 p-4 rounded-lg w-full">
        <h3 className="text-lg font-bold mb-2">Added Food Items</h3>
        <ul>
          {foodServings.map((serving, index) => {
            const foodDetails = foodItems.find((item) => item.id === serving.food_item);

            return (
              <li key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">{foodDetails.name}</h4>
                  <p className="text-sm text-gray-600">{`${serving.quantity}g`}</p>
                  <p className="text-sm text-gray-600">{`Note: ${serving.note}`}</p>
                </div>
                <button
                  onClick={() => handleRemoveFoodServing(index)}
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
