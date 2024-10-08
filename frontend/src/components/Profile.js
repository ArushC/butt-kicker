import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Profile = ({onClose }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/users/${id}`,
            {credentials: 'include'}
        )
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Failed to fetch user data:', error));
    }, [id]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/logout`, {
                method: 'GET',
                credentials: 'include'  //include credentials to ensure the session gets destroyed
            });

            if (response.ok) {
                //indicates that the user's session was successfully destroyed
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
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1000 
        }}>
            <div style={{ 
                backgroundColor: '#d3f0ff', 
                padding: '20px', 
                borderRadius: '10px', 
                width: '300px', 
                position: 'relative', 
                textAlign: 'center',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'red',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        textAlign: 'center',
                        lineHeight: '30px',
                        fontSize: '20px',
                        cursor: 'pointer'
                    }}>
                    &times;
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
