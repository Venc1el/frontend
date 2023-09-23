import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserUmkm() {
    const [umkmPosts, setUmkmPosts] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://delightful-tan-scallop.cyclic.cloud/public/posts')
            .then((response) => {
                setUmkmPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error fetching UMKM posts');
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (category) => {
        if (filterCategory === category) {
            setFilterCategory('All');
        } else {
            setFilterCategory(category);
        }
    };

    const filteredUmkmPosts = filterCategory === 'All'
        ? umkmPosts
        : umkmPosts.filter((post) => post.kategori.includes(filterCategory));

    return (
        <>
            <h1>User UMKM Posts</h1>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredUmkmPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <img className="object-cover w-full h-60 rounded-t-lg" src={`https://delightful-tan-scallop.cyclic.cloud/uploads/${post.image}`} alt="" />
                        </a>
                        <div className="p-5">
                            {post.kategori.split(' ').map((kategori, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleCategoryClick(kategori)}
                                    className={`cursor-pointer inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-normal text-gray-700 mr-2 mb-2 ${filterCategory === kategori ? 'bg-indigo-500 text-white' : ''}`}
                                >
                                    {kategori}
                                </span>
                            ))}
                            <a href="#">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {post.judul}
                                </h5>
                            </a>

                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                {post.content.length > 50
                                    ? `${post.content.slice(0, 50)}...`
                                    : post.content}
                            </p>
                            <Link to={`/umkm/details/${post.id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Read more
                                <svg
                                    className="w-3.5 h-3.5 ml-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M1 5h12m0 0L9 1m4 4L9 9"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default UserUmkm;
