import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function DetailsUmkm() {
    const { postId } = useParams();
    const [umkm, setUmkm] = useState('');

    useEffect(() => {
        axios.get(`https://delightful-tan-scallop.cyclic.cloud/public/posts/${postId}`)
            .then((response) => {
                setUmkm(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [postId]);

    return (
        <div className="container mx-auto mt-8 p-8 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <nav className='my-5'>
                <ol className="flex items-center space-x-2">
                    <li className="inline-flex items-center text-gray-700 dark:text-gray-400 hover:text-blue-600">
                        <Link to="/" className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.39l7-7.6v4.72h4v6.96h-4v4.72l-7-7.6z" />
                            </svg>
                            Home
                        </Link>
                    </li>
                    <li className="inline-flex items-center text-gray-700 dark:text-gray-400 hover:text-blue-600">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.39l7-7.6v4.72h4v6.96h-4v4.72l-7-7.6z" />
                            </svg>
                            <Link to="/umkm">Umkm</Link>
                        </span>
                    </li>
                    <li className="inline-flex items-center text-gray-700 dark:text-gray-400">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.39l7-7.6v4.72h4v6.96h-4v4.72l-7-7.6z" />
                            </svg>
                            {umkm.judul}
                        </span>
                    </li>
                </ol>
            </nav>

            {umkm.image && (
                <img className="object-cover w-full h-60 rounded-t-lg" src={umkm.image} alt={umkm.judul} />
            )}

            <div className="mt-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{umkm.judul}</h1>
                <p className="mt-2 text-gray-700 dark:text-gray-400">{umkm.kategori}</p>
                <div className="mt-4 text-gray-700 dark:text-gray-400">
                    {umkm.content && umkm.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-400">{umkm.alamat}</p>
            </div>
        </div>
    );
}

export default DetailsUmkm;
