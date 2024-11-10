import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Slider } from 'antd';
import { Line } from 'react-chartjs-2';
import 'antd/dist/reset.css';
import 'chart.js/auto';

const moodChoices = [
    "productive", "energetic", "happy", "motivated", 
    "content", "relaxed", "accomplished", "tired", 
    "stressed", "anxious"
];

const DiaryLog = () => {
    const userId = 2;
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [emotionalRating, setEmotionalRating] = useState(5);
    const [logs, setLogs] = useState([]);
    const [latestMoodEmoji, setLatestMoodEmoji] = useState("😐");
    const [isLoading, setIsLoading] = useState(false);
    const [isTodayLogged, setIsTodayLogged] = useState(false);
    const [todayLog, setTodayLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/diary/user_log/${userId}/`);
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
                user: userId,
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

    // Prepare data for the chart
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
            const moods = log.mood_descriptors.split(","); // Split multiple moods if they exist
            moods.forEach(mood => {
                moodCount[mood] = (moodCount[mood] || 0) + 1;
            });
        });
    
        // Find the mood with the maximum count
        const mostLoggedMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);
    
        console.log("Most logged mood:", mostLoggedMood);
    };

    return (
        <div className="min-h-screen w-full bg-white py-8 sm:px-6 lg:px-8">
            <div className="mx-auto bg-white rounded-lg p-8">
                <div className="grid grid-cols-1 gap-6">
                    {/* Today's Mood Section */}
                    <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out text-center">
                        <h2 className="text-3xl font-bold text-white mb-8">
                            {isTodayLogged ? "Today's Mood" : "Log Your Mood"}
                        </h2>
                        {!isTodayLogged ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-4">Select Your Moods</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {moodChoices.map((mood) => (
                                            <label key={mood} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={mood}
                                                    checked={selectedMoods.includes(mood)}
                                                    onChange={() => handleMoodChange(mood)}
                                                    className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all duration-200 ease-in-out"
                                                />
                                                <span className="text-lg text-white capitalize">{mood}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-lg font-medium text-white mb-4">Emotional Rating</label>
                                    <Slider
                                        min={1}
                                        max={10}
                                        value={emotionalRating}
                                        onChange={setEmotionalRating}
                                        tooltipVisible
                                        step={1}
                                        marks={{
                                            1: "1",
                                            2: "2",
                                            3: "3",
                                            4: "4",
                                            5: "5",
                                            6: "6",
                                            7: "7",
                                            8: "8",
                                            9: "9",
                                            10: "10",
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                                >
                                    Submit Mood Log
                                </button>
                            </form>
                        ) : (
                            <div>
                                <p className="text-xl font-medium text-white mb-2">
                                    {todayLog.mood_descriptors.split(",").join(", ")}
                                </p>
                                <p className="text-6xl font-bold text-white mt-6">
                                    {todayLog.emotional_rating}
                                </p>
                                <p className="text-6xl mt-4">{latestMoodEmoji}</p>
                            </div>
                        )}
                    </div>

                    {/* Emotional Rating Over Time Chart Section */}
                    <div className="bg-gradient-to-br from-green-100 to-green-300 p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                        <h3 className="text-2xl font-semibold text-white mb-6">Emotional Rating Over Time</h3>
                        <div className="bg-white shadow-lg rounded-lg hover:shadow-2xl p-4">
                            <div className="h-64">
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
