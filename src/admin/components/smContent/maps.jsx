import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Label, Textarea } from 'flowbite-react';

function Map({ coordinates, setCoordinates, setPopupContent }) {
    const [marker, setMarker] = useState(null);

    // State for the input field below the map
    const [popupInput, setPopupInput] = useState('PJU Rusak');

    function AddMarkerOnClick() {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                const newMarker = { geocode: [lat, lng], draggable: true };
                setMarker(newMarker);
                // Replace the coordinates array with a new array containing only the latest coordinate
                setCoordinates([{ lat: lat.toFixed(6), lng: lng.toFixed(6) }]);
            },
        });

        return null;
    }

    function handleMarkerDrag(event) {
        const { lat, lng } = event.target.getLatLng();
        setMarker({ geocode: [lat, lng], draggable: true });
        // Replace the coordinates array with a new array containing only the latest coordinate
        setCoordinates([{ lat: lat.toFixed(6), lng: lng.toFixed(6) }]);
    }

    // Update the popup content state when the input field changes
    useEffect(() => {
        setPopupContent(popupInput);
    }, [popupInput, setPopupContent]);

    return (
        <div className='mt-8'>
            <MapContainer center={[-7.321904, 112.713885]} zoom={16} style={{ width: "100%" }} scrollWheelZoom={false} touchZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <AddMarkerOnClick />
                {marker && (
                    <Marker
                        position={marker.geocode}
                        draggable={true}
                        eventHandlers={{
                            dragend: (event) => handleMarkerDrag(event),
                        }}
                    >
                        <Popup>{popupInput}</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default Map;
