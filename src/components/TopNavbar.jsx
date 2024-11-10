import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const TopNavbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute since seconds aren't needed

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Format date to "7 Nov"
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  // Format time to "HH:MM" in 24-hour format
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center justify-between bg-gray-900 text-white p-4 fixed top-0 w-full z-50">
      {/* Site Name */}
      <div>
      <Link to="/home" className="text-xl font-semibold hover:bg-grey-100">
        My Fitness Tracker
      </Link>
      </div>

      {/* Profile Icon and Date/Time */}
      <div className="flex items-center space-x-4">
 
          <div>{formatDate(currentTime)}</div>
          <div>{formatTime(currentTime)}</div>

        {/* Profile Icon */}
        <Link to ='profile'>
        <FaUserCircle className="text-3xl" />
        </Link>
        {/* Date and Time */}
        
      </div>
    </div>
  );
};

export default TopNavbar;
