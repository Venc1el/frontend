import React,{ useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from "leaflet";
import customIconImage from '../../../assets/icon.svg';
import fetchUserInfo from '../../../server/getUserId';

function SpecificMapData() {
    const [coordinates, setCoordinates] = useState([]);
    const [userId, setUserId] = useState(null); // State to store user ID

    useEffect(() => {   
        // Fetch user ID after successful login
        fetchUserInfo()
            .then(userId => {
                if (userId) {
                    // Set the retrieved user ID to the state
                    setUserId(userId);
                } else {
                    // Handle the case where user ID is not available (e.g., user not logged in)
                    console.error('User ID not available.');
                }
            })
            .catch(error => {
                // Handle errors that occur during the user ID retrieval
                console.error('Error fetching user ID:', error);
            });
    }, []); // Empty dependency array ensures the effect runs once after the initial render

    useEffect(() => {
        // Fetch user-specific map data based on the stored userId
        if (userId) {
            axios.get(`https://delightful-tan-scallop.cyclic.cloud/maps/user/${userId}`)
                .then((response) => {
                    const { coordinates } = response.data;
                    setCoordinates(coordinates);
                })
                .catch((error) => {
                    console.error('Error fetching user-specific coordinates:', error);
                });
        }
    }, [userId]); // Fetch data whenever userId changes

    const customIcon = new Icon({
        iconUrl: customIconImage,
        iconSize: [32, 32]
    });

    return (
        <div>
            <MapContainer center={[-7.32128, 112.715]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {coordinates.map((data, index) => {
                    const { coordinates, popup_content } = data;

                    if (Array.isArray(coordinates) && coordinates.length > 0 && coordinates[0].lat !== undefined && coordinates[0].lng !== undefined) {
                        const isSingleMarker = coordinates.length === 1;
                        return (
                            <React.Fragment key={index}>
                                {isSingleMarker ? (
                                    <Marker position={[coordinates[0].lat, coordinates[0].lng]} icon={customIcon}>
                                        <Popup>{popup_content}</Popup>
                                    </Marker>
                                ) : (
                                    <React.Fragment>
                                        <Polyline
                                            pathOptions={{ color: 'blue' }}
                                            positions={coordinates.map((coord) => [coord.lat, coord.lng])}
                                        >
                                            <Popup>{popup_content}</Popup>
                                        </Polyline>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
                        );
                    } else {
                        return null;
                    }
                })}
            </MapContainer>
        </div>
    );
}

export default SpecificMapData;
