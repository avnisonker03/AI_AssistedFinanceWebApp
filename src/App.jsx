import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/HomePageComponents/Navbar';
import Footer from './components/HomePageComponents/Footer';
import { Outlet } from 'react-router-dom';
import Drawer from './components/Drawer/Drawer';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Set initial state based on authentication
  useEffect(() => {
    if (isAuthenticated) {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [isAuthenticated]);

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