import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Icon } from 'leaflet';
import customIconImage from '../../../assets/icon.svg';
import fetchUserInfo from '../../../server/getUserId';

function SpecificMapData() {
    const [coordinates, setCoordinates] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch user-specific map data based on the stored userId
        async function fetchData() {
            const id = await fetchUserInfo();
            setUserId(id);

            if (id) {
                axios
                    .get(`https://your-backend-url/maps/user/${id}`)
                    .then((response) => {
                        const { coordinates } = response.data;
                        setCoordinates(coordinates);
                    })
                    .catch((error) => {
                        console.error('Error fetching user-specific coordinates:', error);
                    });
            }
        }

        fetchData();
    }, []);

    const customIcon = new Icon({
        iconUrl: customIconImage, // Use the imported icon image
        iconSize: [32, 32],
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
                                        <Polyline pathOptions={{ color: 'blue' }} positions={coordinates.map((coord) => [coord.lat, coord.lng])}>
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

export default SpecificMapData;
