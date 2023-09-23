import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';


function UmkmForm() {
    const [judul, setJudul] = useState('');
    const [content, setContent] = useState('');
    const [kategori, setKategori] = useState('');
    const [alamat, setAlamat] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);

        if (selectedFile) {
            setUploading(true);
            setTimeout(() => {
                setUploading(false);
                setUploadSuccess(true);
            }, 2000);
        }
    };

    const handleKategoriChange = (e) => {
        const inputText = e.target.value;
        const categories = inputText.split(' ');
        const formattedCategories = categories
            .map((category) => (category.trim() ? `#${category.trim()}` : ''))
            .slice(0, 5)
            .join(' ');

        // Remove extra # characters
        const cleanedCategories = formattedCategories.replace(/#+/g, '#');

        setKategori(cleanedCategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('content', content);
        formData.append('kategori', kategori);
        formData.append('image', image);
        formData.append('alamat', alamat);

        try {
            await axios.post('http://localhost:8081/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            toast.success('Post submitted for review', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            navigate('/syscon/umkm')
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('Error submitting post');
        }
    };

    return (
        <div className="p-2 sm:ml-64">
            <div className="sm:p-4 rounded-lg dark:border-gray-700 mt-20">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Create a Post</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="space-y-8">
                        <div className="border-b border-gray-300 pb-8">
                            <div className='my-5'>
                                <label
                                    htmlFor="kategori"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Kategori
                                </label>
                                <input
                                    type="text"
                                    id="kategori"
                                    value={kategori}
                                    placeholder='Max 5 kategori'
                                    onChange={handleKategoriChange}
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="judul"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    id="judul"
                                    value={judul}
                                    onChange={(e) => setJudul(e.target.value)}
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>


                            <div className="mt-5">
                                <label
                                    htmlFor="content"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Content:
                                </label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={5}
                                    className="block w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <div className='mt-5'>
                                <label
                                    htmlFor="alamat"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Alamat
                                </label>
                                <input
                                    type="text"
                                    id="alamat"
                                    value={alamat}
                                    onChange={(e) => setAlamat(e.target.value)}
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label
                                        htmlFor="file-upload"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Image:
                                        <input
                                            id="file-upload"
                                            name="image_url"
                                            type="file"
                                            className="sr-only"
                                            accept="image/jpeg, image/png, image/gif"
                                            onChange={handleFileChange}
                                            disabled={uploading || uploadSuccess}
                                        />
                                    </label>
                                    {image && (
                                        <div className="mt-2 text-sm leading-6 text-gray-600">
                                            Uploaded Image: {image.name}
                                        </div>
                                    )}
                                    <div
                                        className={`mt-2 flex justify-center rounded-lg border ${uploading || uploadSuccess
                                            ? 'cursor-not-allowed'
                                            : 'cursor-pointer'
                                            } ${uploading || uploadSuccess
                                                ? 'bg-gray-100'
                                                : 'border-dashed border-gray-900/25'
                                            } px-6 py-10 ${uploading || uploadSuccess
                                                ? 'cursor-not-allowed'
                                                : 'cursor-pointer'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className={`relative font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ${uploading || uploadSuccess
                                                        ? 'cursor-not-allowed'
                                                        : 'cursor-pointer'
                                                        }`}
                                                >
                                                    <span>
                                                        {uploadSuccess
                                                            ? 'Upload Success'
                                                            : uploading
                                                                ? 'Uploading...'
                                                                : 'Upload a file'}
                                                    </span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/jpeg, image/png, image/gif"
                                                        onChange={handleFileChange}
                                                        disabled={uploading || uploadSuccess}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs leading-5 text-gray-600">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link to="/syscon/umkm" replace>
                            <button
                                type="button"
                                className="rounded-md bg-red-600 px-3 py-2 text-sm  text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Cancel
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            disabled={uploading}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div >
            <ToastContainer />
        </div >
    );
}

export default UmkmForm;
