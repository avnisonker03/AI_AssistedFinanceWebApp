import React from 'react';
import { ArrowRight, LineChart, PieChart, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden h-screen">
      <div className="max-w-full mx-auto px-6 py-16">
        <div className="relative">
          {/* Animated Background Icons - Increased opacity and brightness */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}  // Increased opacity for better visibility
            transition={{ duration: 1 }}
          >
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
              className="absolute top-10 left-10"
            >
              <LineChart className="h-12 w-12 text-purple-300" /> {/* Brighter, more vibrant color */}
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
              className="absolute bottom-20 right-20"
            >
              <PieChart className="h-16 w-16 text-teal-300" /> {/* Different color for contrast */}
            </motion.div>
            <motion.div
              animate={{ 
                x: [0, 20, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-40 right-40"
            >
              <Wallet className="h-10 w-10 text-pink-300" /> {/* Different color for contrast */}
            </motion.div>
          </motion.div>

          <div className="relative flex flex-col items-center text-center space-y-8">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-100 max-w-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Take Control of Your Finances with 
              <motion.span 
                className="text-blue-400 inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              > AI Assistance!</motion.span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Track your income, expenses, and budgets effortlessly. Get AI-powered insights to improve your financial health.
            </motion.p>

            <motion.button 
              className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to='/login'>
              <span className="text-lg">Get Started for Free</span>
              </Link>
              <ArrowRight className="h-5 w-5" />
            </motion.button>

            <motion.div 
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-700 w-full max-w-3xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { value: "AI-Powered Insights", label: "Helping you make smarter financial decisions" },
                { value: "Simplified Budgeting", label: "Easily track income, expenses & savings" },
                { value: "Secure & Private", label: "Your financial data is safe with us" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center justify-between gap-4"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-xl font-bold text-blue-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.2, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}