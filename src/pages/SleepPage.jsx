import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Carousel } from "antd";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SleepPage = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [sleepLogs, setSleepLogs] = useState([]);
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepAnalysis, setSleepAnalysis] = useState(null);
  const userId = 2;

  const fetchSleepLogs = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/sleep/${userData.id}`);
      setSleepLogs(response.data);
      
    } catch (error) {
      console.error("Error fetching sleep logs:", error);
    }
  };

  const fetchSleepAnalysis = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/sleep/sleep_analysis/${userData.id}`);
      setSleepAnalysis(response.data);
      console.log(sleepAnalysis)
    } catch (error) {
      const fake_response = {
        "user_id": userData.id,
        "daily_sleep_summary": [],
        "average_quality": 0,
        "total_duration": 0
    }
    setSleepAnalysis(fake_response)
    }
  };

 

  useEffect(()=>{
    if(!userData.id){
        dispatch(fetchUserData())
      }
  },[])

  useEffect(() => {
    if(userData.id){
      fetchSleepLogs();
      fetchSleepAnalysis();
    }
  }, [userData]);
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = dayjs(sleepStart, "HH:mm");
    const endTime = dayjs(sleepEnd, "HH:mm");

    if (!startTime.isValid() || !endTime.isValid()) {
      console.error("Invalid time values");
      return;
    }

    const formattedStartTime = startTime.format("YYYY-MM-DDTHH:mm:ss");
    const formattedEndTime = endTime.format("YYYY-MM-DDTHH:mm:ss");

    const payload = {
      sleep_start: formattedStartTime,
      sleep_end: formattedEndTime,
      quality: sleepQuality,
    };

    try {
      console.log(payload)
      const response = await axios.post(`http://127.0.0.1:8000/sleep/${userData.id}/`, payload);
      setSleepLogs([response.data, ...sleepLogs]);
      setSleepStart("");
      setSleepEnd("");
      setSleepQuality(3);
      fetchSleepAnalysis();
      console.log(log)
    } catch (error) {
      console.error("Error logging sleep:", error);
      
    }
  };

  const getSleepQualityEmoji = (quality) => {
    if (quality <= 2) return "😴";
    if (quality === 3) return "😌";
    if (quality === 4) return "😊";
    return "😁";
  };

  const prepareChartData = () => {
    const labels = sleepLogs.map((log) => dayjs(log.sleep_start).format("MMM D"));
    const data = sleepLogs.map((log) => Math.floor(parseFloat(log.duration)) || 0);
    

    return {
      labels,
      datasets: [
        {
          label: "Sleep Duration (hours)",
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 3,
        max: 12,
        ticks: {
          stepSize: 1.5,
        },
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-white py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="col-span-3 bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
            <h2 className="text-2xl font-semibold text-black mb-6">Log Your Sleep</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Sleep Start</label>
                <input
                  id="sleepStart"
                  type="time"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Sleep End</label>
                <input
                  id="sleepEnd"
                  type="time"
                  value={sleepEnd}
                  onChange={(e) => setSleepEnd(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">Sleep Quality</label>
                <select
                  id="sleepQuality"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value={1}>Very Poor</option>
                  <option value={2}>Poor</option>
                  <option value={3}>Fair</option>
                  <option value={4}>Good</option>
                  <option value={5}>Very Good</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Log Sleep
              </button>
            </form>
          </div>

          <div className="col-span-1 bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-black mb-6">Sleep Analysis</h2>
            {sleepAnalysis ? (
              <Carousel autoplay effect="fade" dots={false}>
                <div>
                  <h3 className="text-lg text-5xl text-center font-semibold">{getSleepQualityEmoji(sleepAnalysis.average_quality)}</h3>
                  <p className="text-5xl text-center font-bold">{sleepAnalysis.average_quality.toFixed(1)}</p>
                  <p className="text-sm font-medium text-black">Average Sleep Quality</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black">Total Duration</h3>
                  <p className="text-2xl font-bold text-black">
                    {(sleepAnalysis.total_duration/3600).toFixed(2)} hours
                  </p>
                </div>
              </Carousel>
            ) : (
              <p className="text-black">No sleep analysis data available.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Importance of Good Sleep</h3>
<Carousel autoplay effect="scrollx" dots={false}>
  <div className="flex items-center justify-center h-32 bg-transparent rounded-lg p-6 ">
    <p className="text-2xl font-semibold text-center text-gray-700 leading-relaxed">
      Good sleep improves memory and cognitive function.
    </p>
  </div>
  <div className="flex items-center justify-center h-32 bg-transparent rounded-lg p-6 ">
    <p className="text-2xl font-semibold text-center text-gray-700 leading-relaxed">
      Adequate sleep helps maintain a healthy immune system.
    </p>
  </div>
  <div className="flex items-center justify-center h-32 bg-transparent rounded-lg p-6 ">
    <p className="text-2xl font-semibold text-center text-gray-700 leading-relaxed">
      Sleep promotes emotional well-being and reduces stress.
    </p>
  </div>
</Carousel>

          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-black mb-4">Daily Sleep Graph</h3>
            <Line data={prepareChartData()} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepPage;
