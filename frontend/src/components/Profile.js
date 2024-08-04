import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Profile = ({setIsAuthenticated}) => {
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

    const handleChangePassword = () => {
        // Navigate to a change password page or handle inline
        navigate(`/change-password/${id}`);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px', position: 'absolute', top: '20px', right: '20px', backgroundColor: '#d3f0ff', borderRadius: '10px', width: '300px' }}>
            <h1>Profile</h1>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Current Streak:</strong> {user.current_streak} days</p>
            <p><strong>Maximum Streak:</strong> {user.max_streak} days</p>
            <p><strong>Location:</strong> {user.location}</p>
            <button onClick={handleChangePassword} style={{ margin: '10px', padding: '5px 10px', backgroundColor: '#4B0082', color: '#fff', border: 'none', borderRadius: '5px' }}>Change Password</button>
            <button onClick={handleLogout} style={{ margin: '10px', padding: '5px 10px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '5px' }}>Logout</button>
        </div>
    );
};

export default Profile;