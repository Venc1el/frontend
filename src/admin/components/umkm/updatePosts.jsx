import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'https://delightful-tan-scallop.cyclic.cloud';

function UpdateUmkmPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: '',
    content: '',
    alamat: '',
    kategori: '',
    image: null,
  });

  // Placeholder for upload status states
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    axios.get(`${baseUrl}/umkm/${id}`)
      .then((response) => {
        const post = response.data;
        setFormData({
          judul: post.judul,
          content: post.content,
          alamat: post.alamat,
          kategori: post.kategori,
          image: null,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'image' ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  // Function to format kategori input
  const handleKategoriChange = (e) => {
    const inputText = e.target.value;
    const categories = inputText.split(' ');
    const formattedCategories = categories
      .map((category) => (category.trim() ? `#${category.trim()}` : ''))
      .slice(0, 5)
      .join(' ');

    // Remove extra # characters
    const cleanedCategories = formattedCategories.replace(/#+/g, '#');

    setFormData((prevData) => ({
      ...prevData,
      kategori: cleanedCategories,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set uploading to true when the upload begins
    setUploading(true);

    const postData = new FormData();
    postData.append('judul', formData.judul);
    postData.append('content', formData.content);
    postData.append('alamat', formData.alamat);
    postData.append('kategori', formData.kategori);
    if (formData.image) {
      postData.append('image', formData.image);
    }

    axios.put(`${baseUrl}/umkm/posts/${id}`, postData)
      .then((response) => {
        // Set uploadSuccess to true upon successful upload
        setUploadSuccess(true);

        // Reset uploading state after a short delay (you can adjust the delay as needed)
        setTimeout(() => {
          setUploading(false);
        }, 2000);

        navigate('/syscon/umkm');
      })
      .catch((error) => {
        console.error(error);

        // Handle errors and reset the uploading state
        setUploading(false);
      });
  };

  return (
    <div className='sm:ml-64 mt-20'>
      <div className='sm:p-4 rounded-lg dark:border-gray-700 mt-20'>
        <h1>Update UMKM Post</h1>
        <form onSubmit={handleSubmit}>
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
                  name="kategori"
                  value={formData.kategori}
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
                  name="judul"
                  value={formData.judul}
                  onChange={handleFormChange}
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
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
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
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleFormChange}
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
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg, image/png, image/gif"
                      onChange={handleFileChange}
                    />
                  </label>
                  {formData.image && (
                    <div className="mt-2 text-sm leading-6 text-gray-600">
                      Uploaded Image: {formData.image.name}
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
                className="rounded-md bg-red-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

export default UpdateUmkmPost;
