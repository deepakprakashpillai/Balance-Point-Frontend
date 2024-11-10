import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import axios from "axios";

const EventSection = () => {
    const [events, setEvents] = useState([]);

    // Fetch event data from your API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/event/");
                console.log(response.data);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg  w-full max-w-md mx-auto">
            {events.length > 0 ? (
                <Carousel autoplay className="w-full" arrows infinite={true}>
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="relative h-64 rounded-lg overflow-hidden bg-gray-200 shadow-md"
                        >
                            <img className="bg-cover bg-center w-full h-full" src={`${event.image}`} alt="" />
                           

                            {/* Overlay and Text */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-4 text-center">
                                <h3 className="text-2xl font-semibold text-white mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-white mb-4">{event.content}</p>
                                <p className="text-white font-medium">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            ) : (
                <p className="text-gray-600 text-center">
                    Event information will be available soon.
                </p>
            )}
        </div>
    );
};

export default EventSection;
