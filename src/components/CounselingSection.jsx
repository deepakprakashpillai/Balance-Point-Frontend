import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import axios from "axios";

const CounselingSection = () => {
  const [counselors, setCounselors] = useState([]);

  // Fetch counselor data from your API
  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/counselor/");
        setCounselors(response.data);
      } catch (error) {
        console.error("Error fetching counselors:", error);
      }
    };

    fetchCounselors();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg  w-full max-w-md mx-auto">
      {counselors.length > 0 ? (
        <Carousel autoplay className="w-full" arrows infinite={true}>
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              className="relative h-64 rounded-lg overflow-hidden bg-gray-200 shadow-md"
            >
              {/* Background Image */}
              <img
                alt={counselor.name}
                src={counselor.image || "https://via.placeholder.com/150"}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay and Text */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-4 text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {counselor.name}
                </h3>
                <p className="text-white mb-4">{counselor.designation}</p>
                <p className="text-white font-medium">
                  {counselor.contact_number}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      ) : (
        <p className="text-gray-600 text-center">
          Counselor information will be available soon.
        </p>
      )}
    </div>
  );
};

export default CounselingSection;
