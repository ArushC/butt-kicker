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
  const { username, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await knex('users').insert({ username, password: hashedPassword, name });
    res.status(201).send('User registered');
  } catch (error) {
    //This error can happen if trying to insert a record with a duplicate username
    res.status(400).send(`username "${username}" is already in use.`);
  }
});

// Route to login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await knex('users').where({ username }).first();
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.name = user.name;
      res.status(200).json({ userId: user.id });
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
});

//Route to which users GET if logging out
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('Logout successful');
});

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send('Not authenticated');
  }
  next();
};

// Route to get current user
app.get('/api/user', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ userId: req.session.userId });
  } else {
    res.status(401).send('Not authenticated');
  }
});

// Route to get user by ID
app.get('/api/users/:id', checkAuth, async (req, res) => {
  const { id } = req.params;
  const user = await knex('users').where({ id }).first();
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
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

//endpoint to get cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await knex('cities').select('name');
    res.json(cities.map(city => city.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

//route to update the location of user with id :id
app.put('/:id/location', async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  try {
    await knex('users')
      .where({ id })
      .update({ location });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});