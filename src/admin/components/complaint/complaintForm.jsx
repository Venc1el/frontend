import { useState } from 'react';
import { Label, Textarea } from 'flowbite-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { useMapEvents, MapContainer, TileLayer, Polyline, CircleMarker, Popup, Marker } from 'react-leaflet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Icon} from "leaflet"
import customIconImage from '../../../assets/icon.svg';

function ComplaintForm() {
    const [complaintText, setComplaintText] = useState('');
    const [alamat, setAlamat] = useState('');
    const [type, setType] = useState('PJU');
    const [popupInput, setPopupInput] = useState('');
    const initialKeterangan = type === 'Saluran' ? 'Genangan' : type === 'PJU' ? 'PJU Rusak' : 'Lainnya';
    const [status] = useState('Menunggu Respon');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [coordinates, setCoordinates] = useState([]);
    const [showPoint, setShowPoint] = useState(false);
    const [keterangan, setKeterangan] = useState(initialKeterangan);
    const [showAdditionalInput, setShowAdditionalInput] = useState(false);
    const [marker, setMarker] = useState(null);
    const navigate = useNavigate();

    const customIcon = new Icon({
        iconUrl: customIconImage, // Use the imported icon image
        iconSize: [32, 32]
    });

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files[0];
        setImages(selectedFiles);

        if (selectedFiles.length > 0) {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                setUploadSuccess(true);
            }, 2000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('text', complaintText);
        formData.append('alamat', alamat);
        formData.append('type', type);
        formData.append('status', status);
        formData.append('coordinates', JSON.stringify(coordinates));
        formData.append('popup_content', popupInput);
        formData.append('keterangan', keterangan);

        if (images) {
            formData.append('image', images);
        }

        try {
            await axios.post('https://delightful-tan-scallop.cyclic.cloud/complaints', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Post submitted', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate('/syscon/aduan');
        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

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


    function MapEvents() {
        const map = useMapEvents({
            click(e) {
                addCoordinate(e.latlng.lat, e.latlng.lng);
            },
        });

        return null;
    }


    const undoLastPoint = () => {
        if (coordinates.length > 0) {
            setCoordinates((coords) => coords.slice(0, -1));
            if (coordinates.length === 1) {
                setShowPoint(false);
            }
        }
    };

    const addCoordinate = (lat, lng) => {
        // Add a new coordinate to the array
        const existingCoordinate = coordinates.find(coord => coord.lat === lat && coord.lng === lng);

        if (!existingCoordinate) {
            // Add the new coordinate to the array
            setCoordinates([...coordinates, { lat, lng }]);
        }
        setShowPoint(true)
    };

    return (
        <div className="p-2 sm:ml-64">
            <div className="sm:px-4 rounded-lg dark:border-gray-700 mt-20">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className='my-5'>
                                <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori Aduan</label>
                                <select value={type} onChange={(e) => {
                                    setType(e.target.value);
                                    setShowAdditionalInput(e.target.value === 'Saluran');
                                }} required id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="PJU">PJU</option>
                                    <option value='Saluran'>Saluran</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>

                            {showAdditionalInput && (
                                <div className="max-w-full mb-3" id="additionalInput">
                                    <div className="mb-2 block">
                                        <Label htmlFor="additionalInput" value="Additional Input" />
                                    </div>
                                    <select
                                        id="additionalInput"
                                        type="text"
                                        value={keterangan}
                                        onChange={(e) => setKeterangan(e.target.value)}
                                        placeholder='Additional input...'
                                        required
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value='Genangan'>Genangan</option>
                                        <option value='Perbaikan Saluran'>Perbaikan Saluran</option>
                                    </select>
                                </div>
                            )}
                            <div className="max-w-full" id="textarea">
                                <div className="mb-2 block">
                                    <Label htmlFor="comment" value="Aduan" />
                                </div>
                                <Textarea
                                    id="comment"
                                    value={complaintText}
                                    onChange={(e) => setComplaintText(e.target.value)}
                                    placeholder='Isikan keluhan anda...'
                                    required
                                    rows={4}
                                />
                            </div>
                            <div className="max-w-full" id="textarea">
                                <div className="mb-2 block">
                                    <Label htmlFor="alamat" value="Alamat" />
                                </div>
                                <Textarea
                                    id="alamat"
                                    value={alamat}
                                    onChange={(e) => setAlamat(e.target.value)}
                                    placeholder='Tuliskan alamat...'
                                    required
                                    rows={4}
                                />
                            </div>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="file-upload" className="block text-sm font-medium leading-6 text-gray-900">
                                        Gambar
                                        <input
                                            id="file-upload"
                                            name="image"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading || uploadSuccess}
                                            multiple
                                        />
                                    </label>
                                    {images && (
                                        <div className="mt-2 text-sm leading-6 text-gray-600">
                                            Uploaded Image: {images.name}
                                        </div>
                                    )}
                                    <div className={`mt-2 flex justify-center rounded-lg border ${uploading || uploadSuccess ? 'cursor-not-allowed' : 'cursor-pointer'} ${uploading || uploadSuccess ? 'bg-gray-100' : 'border-dashed border-gray-900/25'} px-6 py-10 ${uploading || uploadSuccess ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                        <div className="text-center">
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`relative font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ${uploading || uploadSuccess ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <span>{uploadSuccess ? 'Upload Success' : uploading ? 'Uploading...' : 'Upload a file'}</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        disabled={uploading || uploadSuccess}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {type === 'Saluran' ? (
                                <div className="mt-10">
                                    <div
                                        className="max-w-full mb-8"
                                        id="textarea"
                                    >
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="comment"
                                                value="Keterangan"
                                            />
                                        </div>
                                        <Textarea
                                            id="comment"
                                            value={popupInput}
                                            onChange={(e) => setPopupInput(e.target.value)}
                                            placeholder='Isikan keterangan (Panjang / Lebar Kerusakan saluran)'
                                            required
                                            rows={2}
                                        />
                                    </div>
                                    {showPoint && (
                                        <div className="my-4">
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white py-2 px-4 rounded-md"
                                                onClick={undoLastPoint}
                                            >
                                                Undo Last Point
                                            </button>
                                        </div>
                                    )}
                                    <MapContainer center={[-7.32128, 112.715]} zoom={13} style={{ height: '400px', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        {coordinates.map((coord, index) => (
                                            <CircleMarker key={index} center={coord} radius={5} />
                                        ))}
                                        <Polyline pathOptions={{ color: 'blue' }} positions={coordinates} >
                                            <Popup>{popupInput}</Popup>
                                        </Polyline>
                                        <MapEvents />
                                    </MapContainer>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="max-w-full mb-8"
                                        id="textarea"
                                    >
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="comment"
                                                value="Keterangan"
                                            />
                                        </div>
                                        <Textarea
                                            id="comment"
                                            value={popupInput}
                                            onChange={(e) => setPopupInput(e.target.value)}
                                            placeholder='Ringkasan Aduan'
                                            required
                                            rows={2}
                                        />
                                    </div>
                                    <MapContainer className='mt-5' center={[-7.321904, 112.713885]} zoom={16} style={{ width: "100%" }} scrollWheelZoom={false} touchZoom={false}>
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
                                                icon = {customIcon}
                                            >
                                                <Popup>{popupInput}</Popup>
                                            </Marker>
                                        )}
                                    </MapContainer>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                            <Link to='/syscon/aduan' replace>
                                Cancel
                            </Link>
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ComplaintForm;
