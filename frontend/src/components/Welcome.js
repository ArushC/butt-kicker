// src/components/Welcome.js
import React, { useState, useEffect } from 'react';

function Welcome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name || user.username}</h1>
      <button onClick={() => fetch('/api/logout').then(() => window.location.reload())}>Logout</button>
    </div>
  );
}

export default Welcome;