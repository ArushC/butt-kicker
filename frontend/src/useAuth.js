// useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

//checks that any user is logged in, else goes to login page
const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
          method: 'GET',
          credentials: 'include' // Ensure credentials (cookies) are sent with the request
        });

        const data = await response.json();

        if (data.userId) {
          // User is authenticated
          sessionStorage.setItem('userId', data.userId);
        } else {
          // User is not authenticated, so go to login page
          navigate('/login');
        }
      } catch (error) {
        // Handle any other errors (optional)
        console.error('Error:', error.message);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);
};

//checks that a user with a specific id is logged in, else goes to login page
const useAuthWithId = (id) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user`, {
          method: 'GET',
          credentials: 'include' // Ensure credentials (cookies) are sent with the request
        });

        const data = await response.json();

        if (data.userId === parseInt(id, 10)) {
          // User is authenticated and ID matches
          sessionStorage.setItem('userId', data.userId);
        } else {
          // User is not authenticated or ID mismatch, so go to login page
          navigate('/login');
        }
      } catch (error) {
        // Handle any other errors (optional)
        console.error('Error:', error.message);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, id]);
};

export { useAuth, useAuthWithId };
