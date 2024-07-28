const express = require('express');
const knex = require('knex')(require('./knexfile').development);
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

//Generate session secret
const crypto = require('crypto');
const session_secret = crypto.randomBytes(64).toString('hex');

app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

//Route to which users POST if creating a new account
app.post('/api/register', async (req, res) => {
  debugger;
  const { username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await knex('users').insert({ username, password: hashedPassword, name });
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

//Route to which users POST if logging into an existing account
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users').where({ username }).first();
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.name = user.name;
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

//Route to which users GET if logging out
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Logout successful');
});

//Route to view this user's welcome page
app.get('/api/user', (req, res) => {
  debugger;
  if (req.session.userId) {
    res.json({ username: req.session.username, name: req.session.name });
  } else {
    res.status(401).send('Not authenticated');
  }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

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