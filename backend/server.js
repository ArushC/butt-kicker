const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get users
app.get('/api/users', async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});