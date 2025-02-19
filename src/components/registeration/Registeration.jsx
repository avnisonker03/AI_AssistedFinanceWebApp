import React from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Registration() {
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

        <form className="mt-8 space-y-6">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>Email</span>
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-300 mb-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
                placeholder="Create a password"
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent hover:cursor-pointer rounded-lg shadow-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
            whileTap={{ scale: 0.98 }}
          >
            Create Account
          </motion.button>

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
            className="w-full hover:cursor-pointer flex items-center justify-center px-4 py-3 border border-gray-600 rounded-lg shadow-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            <span className="text-blue-400 ml-2 hover:underline hover:cursor-pointer">
              Sign In
            </span>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}