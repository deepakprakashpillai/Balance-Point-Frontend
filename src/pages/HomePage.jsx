// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { fetchUserData } from '../store/userThunks';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';


export const HomePage = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.user.userData)
    useEffect(()=>{
        dispatch(fetchUserData());
    },[])
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/exercise">Exercise</Link></li>
          <li><Link to="/diet">Diet</Link></li>
        </ul>
      </nav>
      <h1>Hi, {userData.first_name}</h1>
    </div>
  );
};
