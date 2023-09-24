import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {Icon} from "leaflet"
import customIconImage from '../../../assets/icon.svg';

function AllMapData() {
    const [coordinates, setCoordinates] = useState([]);

    useEffect(() => {
        // Make a GET request to fetch all coordinates from your backend
        axios.get('https://delightful-tan-scallop.cyclic.cloud/maps/all')
            .then((response) => {
                const { coordinates } = response.data; // Access the 'coordinates' property
                setCoordinates(coordinates)
            })
            .catch((error) => {
                console.error('Error fetching coordinates:', error);
            });
    }, []);

    const customIcon = new Icon({
        iconUrl: customIconImage, // Use the imported icon image
        iconSize: [38, 38]
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

                    // Check if coordinates array is not empty and has at least one valid coordinate
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
                        return null; // Skip rendering if coordinates are empty or invalid
                    }
                })}

            </MapContainer>
        </div>
    );
}

export default AllMapData;
