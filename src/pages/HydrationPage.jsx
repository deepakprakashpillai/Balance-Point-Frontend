import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WaterIntakeProgress from '../components/WaterIntakeProgress';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const HydrationPage = () => {
    const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
  const [hydrationLog, setHydrationLog] = useState([]);
  const [amount, setAmount] = useState('');
  const [dailyTotals, setDailyTotals] = useState([]);
  const [lastDrinkTime, setLastDrinkTime] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const userId = 2;
  const dailyGoal = 4;

  const fetchHydrationLog = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/hydration/${userData.id}`);
      setHydrationLog(response.data);
      console.log(response.data)
      updateLastDrinkTime(response.data);
    } catch (error) {
      console.error('Error fetching hydration logs:', error);
    }
  };

  const fetchDailyTotals = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/hydration/total_water_intake_by_user/${userData.id}/`);
      const totals = response.data.daily_totals || [];
      setDailyTotals(totals);
    } catch (error) {
      console.error('Error fetching daily water totals:', error);
    }
  };
  useEffect(()=>{
    if(!userData.id){
        dispatch(fetchUserData())
      }
  },[])
  useEffect(() => {
    fetchHydrationLog();
    fetchDailyTotals();

    const interval = setInterval(() => {
      checkLastDrinkTime();
    }, 3600000);

    return () => clearInterval(interval);
  }, [userData]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount: parseFloat(amount),
    };

    try {
      const response = await axios.post(`http://127.0.0.1:8000/hydration/${userData.id}/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setHydrationLog([response.data, ...hydrationLog]);
      fetchDailyTotals();
      setAmount('');
      setReminderMessage('');
      updateLastDrinkTime([response.data, ...hydrationLog]);
    } catch (error) {
      console.error('Error logging hydration:', error);
    }
  };

  const updateLastDrinkTime = (logs) => {
    if (logs.length > 0) {
      const lastLogTime = new Date(logs[0].timestamp);
      setLastDrinkTime(lastLogTime);
    }
  };

  const checkLastDrinkTime = () => {
    if (lastDrinkTime) {
      const now = new Date();
      const timeDiff = (now - lastDrinkTime) / (1000 * 60 * 60);
      if (timeDiff >= 1) {
        setReminderMessage('It has been more than an hour since your last drink. Please remember to hydrate!');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = hydrationLog.filter(log => log.timestamp.startsWith(today));
  const todayTotalIntake = todayLogs.reduce((total, log) => total + log.amount, 0);
  const dailyGoalReached = todayTotalIntake >= dailyGoal;
  const progressPercent = (todayTotalIntake / dailyGoal) * 100;

  const dates = dailyTotals.map((item) => item.date);
  const totalIntakes = dailyTotals.map((item) => item.total_intake);

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Water Intake (Liters)',
        data: totalIntakes,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3B82F6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Total Daily Water Intake',
        font: {
          size: 18,
          family: 'Poppins, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.raw.toFixed(2) + ' L';
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toFixed(2);
          },
        },
        title: {
          display: true,
          text: 'Total Intake (L)',
        },
        suggestedMax: dailyGoal + 1,
        grid: {
          borderColor: '#D1D5DB',
        },
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-white py-8 sm:px-6 lg:px-8">
    
      <div className="mx-auto bg-white rounded-lg">
        {reminderMessage && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-700">
            {reminderMessage}
          </div>
        )}

        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Log Water Intake spanning 3 columns */}
          <div className="col-span-3 bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Log Your Water Intake</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Enter water amount (in liters):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 0.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Log Hydration
              </button>
            </form>
          </div>

          {/* Today's Water Intake Progress */}
          <div className="col-span-1 bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Progress</h2>
            <WaterIntakeProgress currentIntake={todayTotalIntake} goal={dailyGoal} />
            <p className="mt-2 text-lg text-gray-600">
              <span className="font-semibold">Total Intake:</span> {todayTotalIntake.toFixed(2)} L
            </p>
          </div>
        </div>

        {/* Second row - equally divided */}
        <div className="grid grid-cols-2 gap-6">
          {/* Today's Hydration Logs */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Today's Water Intake</h3>
            {todayLogs.length > 0 ? (
              <div className="space-y-4 max-h-60 overflow-auto">
                <ul>
                  {todayLogs.slice(0, 3).map((log) => (
                    <li key={log.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors duration-300">
                      <p className="text-lg font-medium text-gray-800">
                        <span className="font-semibold">Amount:</span> {log.amount} L
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Time:</span> {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">No hydration logs for today.</p>
            )}
          </div>

          {/* Daily Water Intake Totals */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Daily Water Intake Totals</h3>
            {dailyTotals.length > 0 ? (
              <div className="overflow-hidden h-60 rounded-lg bg-white">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-500">No hydration data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HydrationPage;
