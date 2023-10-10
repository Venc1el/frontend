import { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import Logo from "../../../assets/header.png"

const Login = () => {
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const secretKey = "your-secret-key";


    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("https://delightful-tan-scallop.cyclic.cloud/login", values, {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.status === "Success") {
                    // Assuming your server responds with a token in the response
                    const token = res.data.token;
                    Cookies.set("token", token, { expires:  8/24 , sameSite : "None" , secure : true});
                    const encryptedLevel = CryptoJS.AES.encrypt(
                        res.data.level,
                        secretKey
                    ).toString();
                    localStorage.setItem("encryptedUserLevel", encryptedLevel);
                    window.location.href = "/syscon";
                } else {
                    setErrorMessage(res.data.message);
                }
            })
            .catch((err) => {
                setErrorMessage("Incorrect username or password."); // Handle incorrect credentials
            });
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-c`enter mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img src= {Logo} alt="" className="mr-2 w-32" />
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                                {errorMessage}
                            </div>
                        )}
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    onChange={(e) =>
                                        setValues({ ...values, username: e.target.value })
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={(e) =>
                                        setValues({ ...values, password: e.target.value })
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark-bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
