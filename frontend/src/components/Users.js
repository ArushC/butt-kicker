// src/components/Users.js
import React, { useState, useEffect } from 'react';
import styles from './Users.module.css';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users') //fix this hardcoding
      .then(response => {
        return response.json(); // Properly return the parsed JSON
      })
      .then(data => {
        if (data && data.users) {
          setUsers(data.users); // Ensure data has the users property
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error); // Add error handling
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Users</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Max Streak</th>
            <th className={styles.th}>Username</th>
            <th className={styles.th}>Password</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.max_streak}</td>
              <td className={styles.td}>{user.username}</td>
              <td className={styles.td}>{user.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;