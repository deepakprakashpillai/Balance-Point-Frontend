import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../../store/userSlice';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    console.log('Form submitted:', { username, password });
    try{
        const response = await axios.post("http://127.0.0.1:8000/user/login/",{username,password});
        console.log(response.data);
        const { access,refresh } = response.data;
        localStorage.setItem('access',access)
        localStorage.setItem('refresh',refresh)
        dispatch(setIsLoggedIn(true))
        navigate('/home')

    } catch(error){
        if (error.response) {
            setError(error.response.data.message || 'Login failed, please try again.');
          } else {
            setError('An error occurred. Please try again later.');
          }
          console.error('Error during login:', error);
    };
    
  };

  return (
    <div className="login-component w-full max-w-md mx-auto p-2 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login to Your Account</h2>


      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="input-group">
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Login
          </button>
        </div>
      </form>

      <div className="text-center mt-6">
        <a href="/forgot-password" className="text-blue-500 hover:underline">
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default Login;
