import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const NearbyRestaurantsMap = () => {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [locationInfo, setLocationInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // Initialize the map centered at Thiruvananthapuram coordinates
        mapRef.current = L.map('map').setView([8.5241, 76.9366], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        return () => {
            mapRef.current.remove();
        };
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const getNearbyRestaurants = (latitude, longitude) => {
        markers.forEach(marker => mapRef.current.removeLayer(marker));
        setMarkers([]);

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:2000,${latitude},${longitude})[amenity=restaurant];out;`;

        fetch(overpassUrl)
            .then(response => response.json())
            .then(data => {
                const newMarkers = data.elements.map(location => {
                    const locationLat = location.lat;
                    const locationLon = location.lon;
                    const distance = calculateDistance(latitude, longitude, locationLat, locationLon);

                    const marker = L.marker([locationLat, locationLon]).addTo(mapRef.current);
                    marker.bindPopup(`<b>${location.tags.name || "Restaurant"}</b><br>Distance: ${distance.toFixed(2)} km`);

                    marker.on('click', () => {
                        setLocationInfo({
                            name: location.tags.name || 'Unknown',
                            distance: distance.toFixed(2),
                            lat: locationLat,
                            lon: locationLon
                        });
                        setIsModalVisible(true); // Show the modal on marker click
                    });

                    return marker;
                });

                setMarkers(newMarkers);
            })
            .catch(error => console.error("Error fetching data from Overpass API:", error));
    };

    const handleShowNearbyRestaurants = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLatitude = position.coords.latitude;
                const userLongitude = position.coords.longitude;

                mapRef.current.setView([userLatitude, userLongitude], 13);

                L.marker([userLatitude, userLongitude]).addTo(mapRef.current).bindPopup("You are here").openPopup();

                getNearbyRestaurants(userLatitude, userLongitude);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="bg-white rounded-lg">
            <button 
                onClick={handleShowNearbyRestaurants} 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
            >
                Show Nearby Restaurants
            </button>

            <div id="map" className="mt-6 w-full h-48 rounded-lg shadow-md z-10 "></div>

            {/* Modal to show location info */}
            <Modal
                title="Restaurant Info"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>
                ]}
            >
                {locationInfo && (
                    <>
                        <Title level={4}>Restaurant: {locationInfo.name}</Title>
                        <Paragraph><strong>Distance from you:</strong> {locationInfo.distance} km</Paragraph>
                        <a
                            href={`https://www.google.com/maps?q=${locationInfo.lat},${locationInfo.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button type="link">View on Google Maps</Button>
                        </a>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default NearbyRestaurantsMap;
