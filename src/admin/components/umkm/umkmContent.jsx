import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UseAuth from '../../../server/useAuth';
import { Pagination } from '../../../pagination/pagination';

const baseURL = 'https://delightful-tan-scallop.cyclic.cloud'

function UmkmContent() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(15);
    const [umkmExists, setUmkmExists] = useState(false);
    const { level } = UseAuth();

    const fetchPosts = () => {
        axios.get(`${baseURL}/umkm/posts`)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                    setUmkmExists(response.data.length > 0);
                } else {
                    setError('Invalid data format received from the server');
                }
            })
            .catch((err) => {
                setError('Error loading posts. Please try again later' + err);
            });
    };

    const approvePost = (postId) => {
        axios.patch(`${baseURL}/umkm/posts/${postId}/approve`)
            .then(() => {
                fetchPosts();
            })
            .catch((err) => {
                console.error(err)
            });
    };

    const takeDownPost = (postId) => {
        axios.patch(`${baseURL}/umkm/posts/${postId}/take-down`)
            .then(() => {
                fetchPosts();
            })
            .catch((err) => {
                console.error(err)
            });
    };


    const handleDelete = (postId) => {
        axios
            .delete(`${baseURL}/umkm/${postId}`) // Replace with your API endpoint to delete a post
            .then((response) => {
                // Remove the deleted post from the posts list
                if (response.status === 200) {

                    setPosts(posts.filter((post) => post.id !== postId));
                    toast.error('Post deleted successfully', {
                        position: 'top-right',
                        autoClose: 3000, // 3 seconds
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch((err) => {
                setError('Error deleting post. Please try again later.' + err);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const getCurrentPosts = () => {
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        return posts.slice(indexOfFirstPost, indexOfLastPost);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePostsPerPageChange = (e) => {
		let value = parseInt(e.target.value, 10);
		// Limit posts per page to 250
		if (value > 250) {
			value = 250;
		}
		setPostsPerPage(value);
		setCurrentPage(1);
	};

    return (
        <div className='sm:ml-64 mt-20 p-4'>
            {umkmExists ? (
                <>
                    <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
                        <Link
                            className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                            to='/syscon/umkm/umkm-form'
                        >
                            Posts UMKM
                        </Link>
                        <div className='flex items-center'>
                            <label className='mr-2'>Posts per Page:</label>
                            <input
                                type='number'
                                min='1'
                                value={postsPerPage}
                                onChange={handlePostsPerPageChange}
                                className='border border-gray-300 rounded px-2 py-1 w-16 text-center'
                            />
                        </div>
                    </div>

                    <div className="relative overflow-x-auto shadow-sm sm:rounded-lg mt-8">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-sm text-gray-800 uppercase bg-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Thumbnails
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Judul
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Category
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Alamat
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPosts().map((post) => (
                                    <tr key={post.id} className="bg-white border-b text-xs dark:bg-gray-900 dark:border-gray-700">
                                        {post.image && (
                                            <td className="px-6 py-4">
                                                <img
                                                    src={`${post.image}`}
                                                    alt=""
                                                    className="img-fluid rounded-lg"
                                                    style={{ maxWidth: '50vw', height: '12vh' }}
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4">{post.judul}</td>
                                        <td className="px-6 py-4">{post.kategori}</td>
                                        <td className="px-6 py-4">{post.alamat}</td>
                                        <td className="px-6 py-4 ">
                                            {level === 'Admin' ? (
                                                <>
                                                    <Link
                                                        to={`/syscon/umkm/umkm-details/${post.id}`}
                                                        className="font-medium cursor-pointer text-black hover:underline"
                                                    >
                                                        Lihat Details
                                                    </Link>
                                                    <br />
                                                    <Link
                                                        to={`/syscon/umkm/update/${post.id}`}
                                                        className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
                                                    >
                                                        Update
                                                    </Link>
                                                    <br />
                                                    {post.isApproved ? (
                                                        <a
                                                            onClick={() => takeDownPost(post.id)}
                                                            className="font-medium cursor-pointer text-red-500 dark:text-red-400 hover:underline"
                                                        >
                                                            Take Down
                                                        </a>
                                                    ) : (
                                                        <a
                                                            onClick={() => approvePost(post.id)}
                                                            className="font-medium cursor-pointer text-green-500 dark:text-green-400 hover:underline"
                                                        >
                                                            Approve
                                                        </a>
                                                    )}
                                                    <br />
                                                    <a
                                                        className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        Delete
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        to={`/syscon/umkm/update/${post.id}`}
                                                        className="font-medium cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Update
                                                    </Link>
                                                    <br />
                                                    <Link
                                                        to={`/syscon/umkm/umkm-details/${post.id}`}
                                                        className="font-medium cursor-pointer text-green-600 dark:text-green-400 hover:underline"
                                                    >
                                                        Lihat Details
                                                    </Link>

                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        {error && <p className="text-red-500 mb-4">{error}</p>}
                    </div>
                    <Pagination
                        className="bg-gray-50"
                        totalPages={Math.ceil(posts.length / postsPerPage)}
                        activePage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <div className='sm:ml-54 p-4 w-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
                    <div className=''>
                        <p className='mb-5'>No complaint exists. Please submit a complaint.</p>
                        <Link
                            className=' text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                            to='/syscon/umkm/umkm-form'
                        >
                            Posts Umkm
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
export default UmkmContent