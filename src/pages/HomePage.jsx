// src/components/HomePage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'antd';
import { fetchUserData } from '../store/userThunks';
import { useDispatch, useSelector } from 'react-redux';
import CounselingSection from "../components/CounselingSection";
import EventSection from "../components/EventSection";
import NearbyRestaurantsMap from "../components/NearbyRestaurantsMap";

export const HomePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const isAssessmentDone = false; // Replace with actual logic if available

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-50 p-6">
      {/* Assessment Reminder Bar */}
      {!isAssessmentDone && (
        <Alert
          message={
            <span>
              Have 5 minutes?{' '}
              <Link to="/assessment" className="underline text-blue-600">
                Complete this assessment
              </Link>{' '}
              to get a personalized experience!
            </span>
          }
          type="info"
          showIcon
          banner
          className="mb-4"
        />
      )}

      {/* Welcome & Introductory Section */}
      <div className="grid grid-cols-4 rows-3 gap-4 mb-10">
      <div className="col-span-3 bg-white rounded-lg shadow-lg p-8 row-span-2 text-center space-y-4 transform transition duration-300 hover:scale-105">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
        Welcome to Your Health & Wellness Tracker
    </h1>
    <p className="text-lg text-gray-700 mb-4 leading-relaxed">
        Track your mental and physical well-being all in one place. Start your journey to a healthier you!
    </p>
    <p className="text-gray-600 leading-relaxed">
        With personalized insights, expert tips, and a range of tools, our app is here to help you stay balanced,
        motivated, and on top of your health goals. Track your daily habits, monitor your progress, and make adjustments
        to improve your lifestyle. Whether you're focusing on mental wellness, physical fitness, or simply aiming to feel
        more energized, we've got you covered.
    </p>
</div>




        {/* Counseling Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 text-center row-span-2 transform transition duration-300 hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Counseling</h3>
          <CounselingSection />
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 text-center col-span-2 hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ever Thought about a Cheat Day!!</h3>
          <p className="text-gray-600">
            Explore food courts near you for a refreshing treat!
          </p>
          <NearbyRestaurantsMap />
        </div>

        {/* Nearby Restaurants Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 text-center col-span-2  hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Events</h3>
          <EventSection />
        </div>
      </div>
    </div>
  );
};
