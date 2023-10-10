import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BluePagination } from '../../../pagination/bluePagination';

function UserUmkm() {
    const [umkmPosts, setUmkmPosts] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredUmkmPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='container mx-auto py-8'>
            <h1 className="text-3xl font-medium text-center mb-8">User UMKM Posts</h1>

            {loading && <div className="text-center">Loading...</div>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <div className='flex flex-row flex-wrap gap-4 justify-center px-3'>
                {currentPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        <a href={`/umkm/details/${post.id}`}>
                            <img className="object-cover h-60 rounded-t-lg" src={`${post.image}`} alt="image" style={{ width: "400px" }} />
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

            <BluePagination
                className='bg-gray-50 w-full'
                totalPages={Math.ceil(filteredUmkmPosts.length / postsPerPage)}
                activePage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default UserUmkm;
