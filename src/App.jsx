import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/HomePageComponents/Navbar';
import Footer from './components/HomePageComponents/Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import Drawer from './components/Drawer/Drawer';
import { login } from './store/authSlice';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Set initial state based on authentication
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     setIsDrawerOpen(true);
  //   } else {
  //     setIsDrawerOpen(false);
  //   }
  // }, [isAuthenticated]);
  const navigate=useNavigate();
  const dispatch=useDispatch()
 
useEffect(() => {
  const initializeAuth = () => {
    const token = localStorage.getItem('accessToken');
    const timestamp = localStorage.getItem('authTimestamp');
    
    if (token && timestamp) {
      const currentTime = Date.now();
      const storedTime = parseInt(timestamp);
      const timeDifference = currentTime - storedTime;
      
      // Check if within time limit (e.g., 24 hours = 86400000 ms)
      const TIME_LIMIT = 86400000; // 24 hours
      
      if (timeDifference < TIME_LIMIT) {
        // Token is "fresh enough" - just set authenticated to true
        dispatch(login({ userData: null }));
        navigate('/dashboard')
        // You'll need to fetch user data separately when needed
        // This is the trade-off for not making the API call now
      } else {
        // Token is too old - force re-authentication
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authTimestamp');
        navigate('/login')
      }
    }
    else{
      navigate('/home')
    }
  };
  
  initializeAuth();
}, [dispatch]);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Drawer - Only rendered when authenticated */}
      {isAuthenticated && (
        <Drawer 
          isOpen={isDrawerOpen} 
          toggleDrawer={toggleDrawer} 
        />
      )}
      
      {/* Main Content Wrapper */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isAuthenticated && isDrawerOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Navbar with drawer toggle */}
        <div className="sticky top-0 z-10">
          <Navbar 
            onMenuClick={toggleDrawer} 
            isDrawerOpen={isDrawerOpen} 
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-900 p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}