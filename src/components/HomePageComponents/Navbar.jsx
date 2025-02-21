import React from 'react';
import { Home, BarChart2, ArrowRight, Menu, X , LogOut} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

export default function Navbar({ onMenuClick, isDrawerOpen }) {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const handleLogout = () => {
    // Clear both items
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authTimestamp');
    // Update Redux
    dispatch(logout());
    navigate('/home')
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-md px-6 py-4 sticky top-0 z-50"
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
          {isAuthenticated && (
            <motion.button
              onClick={onMenuClick}
              className="mr-2 p-1 rounded-lg hover:bg-gray-700 text-white z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
            >
              {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          )}
          <Home className="h-7 w-7 text-blue-400" />
          <span className="text-2xl font-bold text-gray-100">SpendWise</span>
        </motion.div>

        {!isAuthenticated &&
           <div className="flex items-center space-x-6">
           <motion.button
             className="flex items-center space-x-2 hover:cursor-pointer px-4 py-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
           >
             <BarChart2 className="h-6 w-6" />
             <Link to='/login'>
             <span className="text-lg">Dashboard</span>
             </Link>
           </motion.button>
 
           <motion.button
             className="flex items-center space-x-2 hover:cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 shadow-md"
             whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
             whileTap={{ scale: 0.95 }}
           >
            <Link to='/login'>
             <span className="text-lg">Get Started</span>
             </Link>
             <ArrowRight className="h-5 w-5" />
           </motion.button>
         </div>
        }
        {isAuthenticated && 
        <div onClick={handleLogout}>
        <LogOut className="h-7 w-7 text-blue-400 hover:cursor-pointer"/>
        </div>}
      </div>
    </motion.nav>
  );
}