import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = ({ setIsAuthenticated, onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Failed to fetch user data:', error));
    }, [id]);

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include'  // Include credentials to ensure the session is destroyed
            });

            if (response.ok) {
                // Clear session storage
                sessionStorage.clear();
                // Optionally handle any additional post-logout logic here
                setIsAuthenticated(false);
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={modalStyle}>
            <div style={modalContentStyle}>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
                <h1>Profile</h1>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Current Streak:</strong> {user.current_streak} days</p>
                <p><strong>Maximum Streak:</strong> {user.max_streak} days</p>
                <p><strong>Location:</strong> {user.location}</p>
                <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
            </div>
        </div>
    );
};

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#d3f0ff', // Match the background color with the home page
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    position: 'relative',
    textAlign: 'center',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'red',
    fontSize: '20px',
    cursor: 'pointer',
};

const logoutButtonStyle = {
    margin: '10px',
    padding: '5px 10px',
    backgroundColor: '#4B0082', // Match the color of the "checkin for yesterday" button
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
};

export default Profile;