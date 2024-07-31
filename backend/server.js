const express = require('express');
const knex = require('./knex'); // Import knex instance
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const app = express();
const port = 5000;

// Generate session secret
const session_secret = crypto.randomBytes(64).toString('hex');

// Middleware setup
app.use(cors({
  origin: ['http://localhost:3000'], // Add other allowed origins here
  methods: ['POST', 'GET', 'PUT', 'DELETE'], // Add the methods you want to allow
  credentials: true // Allow credentials if you're using cookies for authentication
}));
app.use(express.json()); // Parse JSON bodies
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Import and use routes
const journalRoutes = require('./routes/journal');
app.use('/api/journal', journalRoutes);

// Route to register a new user
app.post('/api/register', async (req, res) => {
  const { username, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex('users').insert({ username, password: hashedPassword, name });
    res.status(201).send('User registered');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send(`Username "${username}" is already in use.`);
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

// Route to logout
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
  try {
    const user = await knex('users').where({ id }).first();
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to get cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await knex('cities').select('name');
    res.json(cities.map(city => city.name));
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Route to update the location of a user
app.put('/api/users/:id/location', async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;

  try {
    await knex('users').where({ id }).update({ location });
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
