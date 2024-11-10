// Success.js
import React from 'react';

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Submission Successful!</h2>
      <p className="text-gray-700">Thank you for completing the assessment.</p>
      <p className="text-gray-500 mt-2 text-center">You can view and change your responses from the profile section</p>
    </div>
  );
};

export default Success;
