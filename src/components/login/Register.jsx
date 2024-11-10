import React from 'react';
import { useState } from 'react';
import axios from 'axios';

export const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        place: '',
        gender: '',
        phone_number: '',
        dob: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(formData);

        try{
            const response = await axios.post("http://127.0.0.1:8000/user/register/",formData);
        console.log(response.data);
        }
        catch(error){
            console.error("Error during register",error)
        }
        

      };
  return (
    <div className="register-form w-full max-w-md  bg-white rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Create your account now!</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div className="input-group">
          <label htmlFor="first_name" className="block text-sm font-semibold text-gray-600">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label htmlFor="last_name" className="block text-sm font-semibold text-gray-600">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Email Address */}
        <div className="input-group">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Username */}
        <div className="input-group">
          <label htmlFor="username" className="block text-sm font-semibold text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Place */}
        <div className="input-group">
          <label htmlFor="place" className="block text-sm font-semibold text-gray-600">Place</label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Gender */}
        <div className="input-group">
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-600">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* phone_number Number */}
        <div className="input-group">
          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-600">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="input-group">
          <label htmlFor="dob" className="block text-sm font-semibold text-gray-600">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all"
        >
          Register
        </button>
      </form>
    </div>
  );
};