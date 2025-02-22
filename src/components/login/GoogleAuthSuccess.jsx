import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      // Get data from URL
      const urlParams = new URLSearchParams(window.location.search);
      const encodedData = urlParams.get('data');
      
      if (encodedData) {
        const userDetails = JSON.parse(decodeURIComponent(encodedData));
        
        // Save to localStorage
        localStorage.setItem('accessToken', userDetails.accessToken);
        localStorage.setItem('authTimestamp', Date.now().toString());
        
        // Update Redux state
        dispatch(login(userDetails));
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  }, [navigate, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-300">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;