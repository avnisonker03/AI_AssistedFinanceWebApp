import React from 'react';
import { Home, BarChart2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      className="bg-gradient-to-r from-blue-50 to-white shadow-sm px-6 py-4 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-full mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Home className="h-7 w-7 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">SpendWise</span>
        </motion.div>
        
        <div className="flex items-center space-x-6">
          <motion.button 
            className="flex items-center space-x-2 hover:cursor-pointer px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart2 className="h-6 w-6" />
            <span className="text-lg">Dashboard</span>
          </motion.button>
          
          <motion.button 
            className="flex items-center space-x-2 hover:cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}