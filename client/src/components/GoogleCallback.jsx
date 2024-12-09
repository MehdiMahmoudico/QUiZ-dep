import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const GoogleLoginCallback = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the token from the URL (assuming it's passed as a URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const userName = urlParams.get('userName');
    const userRole = urlParams.get('userRole');

    if (token && userId && userName && userRole) {
      // Use the login function from AuthContext to set authentication state
      login(userName, token, userRole, userId);
      
      // Redirect to main page or dashboard
      navigate('/');
    } else {
      // Handle error case
      console.error('Missing authentication details');
      navigate('/login');
    }
  }, [login, navigate]);

  return <div>Processing Google Login...</div>;
};

export default GoogleLoginCallback;