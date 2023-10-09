import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Label, Textarea } from 'flowbite-react';

function ComplaintResponse() {
    const { id } = useParams();
    const [text, setText] = useState('');
    const [status, setStatus] = useState('Dilaporkan');
    const [images, setSelectedImage] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const navigate = useNavigate()

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setSelectedImage(selectedFile);

        if (selectedFile) {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                setUploadSuccess(true);
            }, 2000);
        }
    };


    const handleSubmitResponse = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('text', text || '');
            formData.append('status', status);

            formData.append('image_url', images || '');

            setUploading(true);

            await axios.post(
                `https://delightful-tan-scallop.cyclic.cloud/complaints/${id}/responses`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate('/syscon/aduan')
            setUploadSuccess(true)
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false)
        }
    };

    return (
        <div className="p-2 sm:ml-64">
            <div className="sm:p-4 rounded-lg dark:border-gray-700 mt-20">
                <form onSubmit={handleSubmitResponse} encType="multipart/form-data" >
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">

                            <div className='my-5'>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori Aduan</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)} required id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value='Dilaporkan'>Dilaporkan</option>
                                    <option value="Diusulkan">Diusulkan</option>
                                    <option value="Direncana Tindak Lanjuti">Direncana Tindak Lanjuti</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>

                            <div
                                className="max-w-full"
                                id="textarea"
                            >
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="complaint"
                                        value="Response Aduan"
                                    />
                                </div>
                                <Textarea
                                    id="complaint"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)} // Ensure this line
                                    placeholder='Isikan response dari keluhan'
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
                                            name="image_url"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading || uploadSuccess}
                                            multiple // Allow multiple file selection
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
        </div>
    );
}

export default ComplaintResponse;
