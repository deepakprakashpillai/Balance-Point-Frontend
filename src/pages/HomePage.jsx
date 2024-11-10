// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { fetchUserData } from '../store/userThunks';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import CounselingSection from "../components/CounselingSection";
import EventSection from "../components/EventSection";
import NearbyRestaurantsMap from "../components/NearbyRestaurantsMap";

export const HomePage = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.user.userData)
    useEffect(()=>{
        dispatch(fetchUserData());
    },[])
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-50 p-6">
      {/* Welcome & Introductory Section */}
      <div className="grid grid-cols-4 rows-3 gap-4 mb-10">
        <div className="col-span-3 row-span-2 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Health & Wellness Tracker</h1>
          <p className="text-gray-600">Track your mental and physical well-being all in one place. Start your journey to a healthier you!</p>
        </div>
        {/* Counseling Section */}
        <div className="bg-white rounded-lg  shadow-lg p-4 text-center row-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Counseling</h3>
          <CounselingSection /></div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 text-center col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Cheat Day Spots</h3>
          <p className="text-gray-600">Explore food courts near you for a refreshing treat!</p>
          <NearbyRestaurantsMap />
        </div>

        {/* Nearby Restaurants Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 text-center col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Events</h3>
          <EventSection />
        </div>
      </div>
    </div>
  );
};
