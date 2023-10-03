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

            {loading &&
                <div classname="flex items-center justify-center h-screen">
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
            {error && <p>{error}</p>}

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {filteredUmkmPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href="#">
                            <img className="object-cover w-full h-60 rounded-t-lg" src={`${post.image}`} alt="" />
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
