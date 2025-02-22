import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from '../../../env';

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    otp: ''
  });
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate('/dashboard')

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.sendOTP, {
        email: formData.email
      });
      
      if (response.data) {
        setOtpSent(true);
        setMessage('OTP sent successfully! Please check your email.');
        setStep(2);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.verifyOTP, {
        email: formData.email,
        otp: formData.otp
      });
      
      if (response.data) {
        setOtpVerified(true);
        setMessage('OTP verified successfully!');
        setStep(3);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage('Please verify your email first.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.registeration, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data) {
        setMessage('Registration successful!');
        navigate('/login')
        // Handle successful registration (redirect, etc.)
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = API_ENDPOINTS.googleSignIn;
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
          <User className="h-12 w-12 text-purple-300" />
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
          <Mail className="h-16 w-16 text-teal-300" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 relative z-10"
      >
        <div className="text-center">
          <motion.h2 
            className="text-3xl font-bold text-gray-100"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Create Account
          </motion.h2>
          <motion.p 
            className="mt-2 text-gray-300"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join SpendWise today
          </motion.p>
        </div>

        {message && (
          <div className={`text-sm text-center p-3 rounded-lg ${message.includes('success') ? 'bg-green-800 text-green-100' : 'bg-gray-700 text-gray-200'}`}>
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {step >= 1 && (
              <>
                <div>
                  <label className="flex items-center space-x-2 text-gray-300 mb-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-gray-300 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                    placeholder="Enter your email"
                    disabled={loading || otpSent}
                  />
                </div>

                {!otpSent && (
                  <motion.button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || !formData.email || !formData.fullName}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </motion.button>
                )}
              </>
            )}

            {step >= 2 && otpSent && !otpVerified && (
              <div>
                <label className="flex items-center space-x-2 text-gray-300 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span>Enter OTP</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  placeholder="Enter OTP"
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading || !formData.otp}
                  className={`w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </motion.button>
              </div>
            )}

            {step >= 3 && otpVerified && (
              <div>
                <label className="flex items-center space-x-2 text-gray-300 mb-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                  placeholder="Create a password"
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.password}
                  className={`w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </div>
            )}
          </motion.div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or sign up with</span>
            </div>
          </div>

          <motion.button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
          >
            Sign up with Google
          </motion.button>
          
          <motion.div
            className="text-center text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Already have an account?
            <Link to='/login'>
              <span className="text-blue-400 ml-2 hover:underline">
                Sign In
              </span>
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}