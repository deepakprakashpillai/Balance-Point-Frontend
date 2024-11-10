import React, { useState } from 'react';
import Illustration from '../assets/Info.png'; // Replace with your image path
import Login from '../components/login/Login'; // Default import
import { Register } from '../components/login/Register'; // Named import

export const LoginPage = ({setIsLoggedIn}) => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="login-page flex justify-center items-center min-h-screen w-full bg-gray-100">
      {/* Left Side - Illustration */}
      <div className="left-side flex justify-center items-center w-[40%] max-w-[500px] p-6">
        <img
          src={Illustration}
          alt="Illustration"
          className="w-80 h-80 object-contain transition-all duration-300"
        />
      </div>

      {/* Right Side - Login/Register Components */}
      <div 
        className="right-side flex flex-col justify-start items-center w-[500px] bg-white rounded-lg p-8 shadow-lg max-h-[80vh] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',  // For Firefox
          msOverflowStyle: 'none',  // For Internet Explorer
        }}
      >
        {/* Tab Navigation */}
        <div className="tabs flex justify-center mb-6 w-full">
          <button
            onClick={() => handleTabChange('login')}
            className={`tab-button w-1/2 py-3 text-lg font-semibold rounded-l-md ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-all`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`tab-button w-1/2 py-3 text-lg font-semibold rounded-r-md ${activeTab === 'register' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-all`}
          >
            Register
          </button>
        </div>

        {/* Conditional Rendering of Components */}
        {activeTab === 'login' ? <Login setIsLoggedIn={setIsLoggedIn}/> : <Register/>}
      </div>
    </div>
  );
};
