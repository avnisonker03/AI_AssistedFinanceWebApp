import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_ENDPOINTS from '../../../env';

export default function Login() {
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
                localStorage.setItem('token', response.data.token);
                console.log("response",response)
                
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // const response = await axios.get(API_ENDPOINTS.googleSignIn);
            window.location.href = 'http://localhost:3000/user/auth/google';

            // if (response.data) {
            //     localStorage.setItem('token', response.data.token);
            //     console.log("response",response)
                
            // }

        } catch (err) {
            setError("Google sign-in failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-8 px-4 -mt-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <form onSubmit={handleEmailLogin} className="mt-8 space-y-6">
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div>
                            <label className="flex items-center space-x-2 text-gray-700 mb-2">
                                <Mail className="w-5 h-5" />
                                <span>Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 text-gray-700 mb-2">
                                <Lock className="w-5 h-5" />
                                <span>Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 hover:cursor-pointer text-lg border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </motion.button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <motion.button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex hover:cursor-pointer text-lg items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign in with Google
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}