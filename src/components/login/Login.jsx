import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_ENDPOINTS from '../../../env';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // const handleGoogleLogin = async (credentialResponse) => {
    //     setLoading(true);
    //     setError("");
    //     try {
    //         console.log("Google Login Success: Credential Received"); // Debug log

    //         // const response = await axios.get(API_ENDPOINTS.googleSignIn);

    //         // console.log("Server Response:", response.data); // Debug log

    //         // if (response.data) {
    //         //     localStorage.setItem('accessToken', response.data.accessToken);
    //         //     // localStorage.setItem('refreshToken', response.data.refreshToken);
    //         //     localStorage.setItem('authTimestamp', Date.now().toString());

    //         //     dispatch(login(response.data.userDetails));

    //         //     console.log("Navigating to dashboard..."); // Debug log
    //         //     navigate('/dashboard');
    //         // }
    //         window.location.href = API_ENDPOINTS.googleSignIn;
    //     } catch (err) {
    //         console.log("Error",err)
    //         console.error("Google Login Error:", err.response?.data?.message || err.message);
    //         setError(err.response?.data?.message || "Google login failed");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const handleGoogleLogin = () => {
        // Simply redirect to backend Google auth route
        // const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
        window.location.href = API_ENDPOINTS.googleSignIn;
    };


    const handleGoogleFailure = (error) => {
        setError("Google authentication failed: " + (error.error || "Unknown error"));
        setLoading(false);
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(API_ENDPOINTS.login, {
                email: formData.email,
                password: formData.password
            });

            if (response.data) {
                localStorage.setItem('accessToken', response.data.userDetails.accessToken);;
                localStorage.setItem('authTimestamp', Date.now().toString());
                console.log("response", response)
                dispatch(login(response.data.userDetails))
                navigate('/dashboard')

            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-8 px-4">
            {/* Animated Background Icons */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 opacity-10"
                >
                    <Mail className="h-12 w-12 text-purple-300" />
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute bottom-20 right-20 opacity-10"
                >
                    <Lock className="h-16 w-16 text-teal-300" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mb-8 w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 relative z-10"
            >
                <div className="text-center">
                    <motion.h2
                        className="text-3xl font-bold text-gray-100"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        className="mt-2 text-gray-300"
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Sign in to your account
                    </motion.p>
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/30 py-2 rounded-lg">{error}</div>
                )}

                <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div>
                            <label className="flex items-center space-x-2 text-gray-300 mb-2">
                                <Mail className="w-5 h-5 text-blue-400" />
                                <span>Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-gray-300 mb-2">
                                <Lock className="w-5 h-5 text-blue-400" />
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 hover:cursor-pointer text-lg border border-transparent rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </motion.button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <motion.button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex hover:cursor-pointer text-lg items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign in with Google
                    </motion.button>

                    <motion.div
                        className="text-center text-gray-400 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Don't have an account?
                        <span className="text-blue-400 ml-2 hover:underline hover:cursor-pointer">
                            Create Account
                        </span>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
}