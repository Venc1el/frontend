import { useEffect, useState } from "react";
import axios from "axios";
import AddUsers from "./addUser";
import { Pagination } from "../../../pagination/pagination";

function UserContent() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  useEffect(() => {
    const axiosInstance = axios.create({
      withCredentials: true,
    });

    axiosInstance
      .get("https://delightful-tan-scallop.cyclic.cloud/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user);
    setNewName(user.username);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    // Send a PUT request to update the user
    axios
      .put(`https://delightful-tan-scallop.cyclic.cloud/users/${editUser.iduser}`, {
        username: newName,
        password: newPassword,
      })
      .then(() => {
        const updatedUsers = users.map((user) =>
          user.iduser === editUser.iduser ? { ...user, username: newName } : user
        );
        setUsers(updatedUsers);
        setEditUser(null);
        // Reset password fields and validation
        setNewPassword("");
        setConfirmPassword("");
        setPasswordsMatch(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
            // Username already exists, show an alert
            window.alert('Username already exists. Please choose a different username.');
          } else {
            // Other errors, log the error or show a generic error message
            console.error('Error updating user:', error);
            window.alert('Error updaating user. Please try again later.');
          }
      });
  };

  const handleAddUser = (user) => {
    // Send a POST request to add a new user
    axios
      .post("https://delightful-tan-scallop.cyclic.cloud/users", {
        username: user.username,
        password: user.password,
        level: user.level,
        aktif: 0,
      })
      .then((response) => {
        // Reload the user list by making another GET request
        axios
          .get("https://delightful-tan-scallop.cyclic.cloud/users")
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          // Username already exists, show an alert
          window.alert('Username already exists. Please choose a different username.');
        } else {
          // Other errors, log the error or show a generic error message
          console.error('Error adding user:', error);
          window.alert('Error adding user. Please try again later.');
        }
      });
  };

  const handleDeleteClick = (userId) => {
    // Check if the user has posts
    axios
      .get(`https://delightful-tan-scallop.cyclic.cloud/users/${userId}/hasposts`)
      .then((response) => {
        const { hasPosts } = response.data;
        if (hasPosts) {
          // If the user has posts, show an alert and don't proceed with deletion
          alert("This user has posts in the 'aduan' and cannot be deleted.");
        } else {
          // If the user doesn't have posts, open the delete confirmation modal
          setUserToDelete(userId);
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error checking user posts:", error);
      });
  };


  const handleDeleteUser = (userId) => {
    axios
      .delete(`https://delightful-tan-scallop.cyclic.cloud/users/${userId}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user.iduser !== userId);
        setUsers(updatedUsers);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });

    closeModal();
  };

  const getCurrentPosts = () => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return users.slice(indexOfFirstPost, indexOfLastPost);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="p-1 sm:ml-64">
      <div className="sm:p-4 rounded-lg dark:border-gray-700 mt-20">
        <AddUsers onAddUser={handleAddUser} />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPosts().map((user) => (
                <tr
                  key={user.iduser}
                  className={`text-xs bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${user.aktif === 1 ? "online" : "offline"
                    }`}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div>
                      <div className="text-sm">{user.username}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{user.level}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${user.aktif === 1 ? "bg-green-500" : "bg-red-500"
                          } mr-2`}
                      />
                      {user.aktif === 1 ? "Online" : "Offline"}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex flex-col">
                    {/* Modal toggle */}
                    <a
                      type="button"
                      onClick={() => handleEditClick(user)}
                      className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit user
                    </a>

                    <a
                      type="button"
                      onClick={() => handleDeleteClick(user.iduser)}
                      className="cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Remove
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Delete user Modal */}
          {isModalOpen && userToDelete !== null && (
            <div className="fixed top-0 left-0 right-0 inset-0 flex z-50 items-center justify-center w-full h-screen bg-opacity-50 bg-gray-900">
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="p-6 text-center">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete your account?
                    </h3>
                    <button
                      onClick={() => handleDeleteUser(userToDelete)}
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      onClick={closeModal}
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit user modal */}
          {editUser && (
            <div className="fixed top-0 left-0 right-0 inset-0 flex z-50 items-center justify-center w-full h-screen bg-opacity-50 bg-gray-900">
              <div className="relative flex justify-center w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <form
                  onSubmit={handleEditSubmit}
                  className="relative bg-white rounded-lg shadow dark:bg-gray-700"
                >
                  {/* Modal header */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Edit user
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="modal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="current-name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Current Name
                        </label>
                        <input
                          type="text"
                          name="current-name"
                          id="current-name"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editUser ? editUser.username : ""}
                          required=""
                          readOnly
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="new-name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          New Name
                        </label>
                        <input
                          type="text"
                          name="new-name"
                          id="new-name"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="New Name"
                          onChange={(e) => setNewName(e.target.value)}
                          required=""
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="new-password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          name="new-password"
                          id="new-password"
                          className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!passwordsMatch ? "border-red-500" : ""
                            }`}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required=""
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="confirm-password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark-bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${!passwordsMatch ? "border-red-500" : ""
                            }`}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required=""
                        />
                      </div>
                    </div>
                  </div>
                  {/* Modal footer */}
                  <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Save all
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                      Cancel
                    </button>
                  </div>
                  {/* Password mismatch error */}
                  {!passwordsMatch && (
                    <div className="text-red-500 text-sm mt-2">
                      Passwords do not match.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <Pagination
        className="bg-gray-50 w-full"
        totalPages={Math.ceil(users.length / postsPerPage)}
        activePage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default UserContent;
