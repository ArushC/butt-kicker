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
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <div style={{ 
                backgroundColor: '#d3f0ff', 
                padding: '20px', 
                borderRadius: '10px', 
                width: '300px', 
                position: 'relative', 
                textAlign: 'center' 
            }}>
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'red',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}>
                    ✖
                </button>
                <h1>Profile</h1>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Current Streak:</strong> {user.current_streak} days</p>
                <p><strong>Maximum Streak:</strong> {user.max_streak} days</p>
                <p><strong>Location:</strong> {user.location}</p>
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        margin: '10px', 
                        padding: '5px 10px', 
                        backgroundColor: '#4B0082', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '5px', 
                        cursor: 'pointer'
                    }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;