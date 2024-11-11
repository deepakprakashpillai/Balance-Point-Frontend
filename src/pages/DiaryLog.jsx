import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Slider } from 'antd';
import { Line } from 'react-chartjs-2';
import 'antd/dist/reset.css';
import 'chart.js/auto';
import {useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../store/userThunks';

const moodChoices = [
    "productive", "energetic", "happy", "motivated", 
    "content", "relaxed", "accomplished", "tired", 
    "stressed", "anxious"
];

const DiaryLog = () => {
    const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userData)
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [emotionalRating, setEmotionalRating] = useState(5);
    const [logs, setLogs] = useState([]);
    const [latestMoodEmoji, setLatestMoodEmoji] = useState("😐");
    const [isLoading, setIsLoading] = useState(false);
    const [isTodayLogged, setIsTodayLogged] = useState(false);
    const [todayLog, setTodayLog] = useState(null);


    useEffect(() => {
        if(!userData.id){
            dispatch(fetchUserData())
          }
    },[])
    useEffect(() => {
        if(userData.id){
        fetchLogs();
        }
    }, [userData]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/diary/user_log/${userData.id}/`);
            const sortedLogs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setLogs(sortedLogs);

            if (sortedLogs.length > 0) {
                const latestLogDate = new Date(sortedLogs[0].date);
                const today = new Date();
                const isLoggedToday =
                    latestLogDate.getDate() === today.getDate() &&
                    latestLogDate.getMonth() === today.getMonth() &&
                    latestLogDate.getFullYear() === today.getFullYear();
                
                setIsTodayLogged(isLoggedToday);

                if (isLoggedToday) {
                    setTodayLog(sortedLogs[0]);
                    setLatestMoodEmoji(getEmojiForRating(sortedLogs[0].emotional_rating));
                }
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        }
        setIsLoading(false);
    };

    const handleMoodChange = (mood) => {
        if (selectedMoods.includes(mood)) {
            setSelectedMoods(selectedMoods.filter(item => item !== mood));
        } else {
            setSelectedMoods([...selectedMoods, mood]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const moodDescriptorsString = selectedMoods.join(",");
            await axios.post("http://127.0.0.1:8000/diary/", {
                user: userData.id,
                mood_descriptors: moodDescriptorsString,
                emotional_rating: emotionalRating
            });
            setSelectedMoods([]);
            setEmotionalRating(5);
            fetchLogs();
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const getEmojiForRating = (rating) => {
        if (rating >= 8) return "😊";
        if (rating >= 6) return "🙂";
        if (rating >= 4) return "😐";
        if (rating >= 2) return "😟";
        return "😞";
    };

    const chartData = {
        labels: logs.map(log => new Date(log.date).toLocaleDateString()),
        datasets: [
            {
                label: "Emotional Rating",
                data: logs.map(log => log.emotional_rating),
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 10,
                ticks: {
                    stepSize: 2
                }
            }
        }
    };

    useEffect(() => {
        findMostLoggedMood();
    }, [logs]);
    
    const findMostLoggedMood = () => {
        if (logs.length === 0) {
            console.log("No mood logs available.");
            return;
        }
    
        const moodCount = {};
    
        logs.forEach(log => {
            const moods = log.mood_descriptors.split(",");
            moods.forEach(mood => {
                moodCount[mood] = (moodCount[mood] || 0) + 1;
            });
        });
    
        const mostLoggedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
        console.log("Most logged mood:", mostLoggedMood);
    };

    return (
        <div className="min-h-screen w-full bg-white py-8 sm:px-6 lg:px-8 font-sans text-black">
            <div className="mx-auto bg-white rounded-lg p-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Today's Mood Section */}
                    <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-2xl font-bold mb-6">
                            {isTodayLogged ? "Today's Mood" : "Log Your Mood"}
                        </h2>
                        {!isTodayLogged ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-md font-medium mb-2">Select Your Moods</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {moodChoices.map((mood) => (
                                            <label key={mood} className="flex items-center space-x-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={mood}
                                                    checked={selectedMoods.includes(mood)}
                                                    onChange={() => handleMoodChange(mood)}
                                                    className="form-checkbox h-4 w-4 text-gray-500 border-gray-300 rounded focus:ring-2 focus:ring-gray-500"
                                                />
                                                <span className="text-sm capitalize">{mood}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-md font-medium mb-2">Emotional Rating</label>
                                    <Slider
                                        min={1}
                                        max={10}
                                        value={emotionalRating}
                                        onChange={setEmotionalRating}
                                        tooltipVisible
                                        step={1}
                                        marks={{
                                            1: "1",
                                            5: "5",
                                            10: "10",
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-gray-700"
                                >
                                    Submit Mood Log
                                </button>
                            </form>
                        ) : (
                            <div>
                                <p className="text-lg font-medium mb-2">
                                    {todayLog.mood_descriptors.split(",").join(", ")}
                                </p>
                                <p className="text-5xl font-bold mt-4">
                                    {todayLog.emotional_rating}
                                </p>
                                <p className="text-5xl mt-4">{latestMoodEmoji}</p>
                            </div>
                        )}
                    </div>

                    {/* Emotional Rating Over Time Chart Section */}
                    <div className="bg-gradient-to-br from-pink-100 to-pink-300 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Emotional Rating Over Time</h3>
                        <div className="bg-white shadow rounded p-4">
                            <div className="h-56">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiaryLog;
