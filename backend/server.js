const express = require('express');
const knex = require('./knex');
const session = require('express-session');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createServer } = require('http'); // Import createServer
const { Server } = require('socket.io');
const { updateState } = require('./utils');
const app = express();
const PORT = process.env.PORT || 7160;
const SOCKET_PORT = process.env.SOCKET_PORT || PORT; // Use the same port

// Generate session secret
const session_secret = crypto.randomBytes(64).toString('hex');

// Middleware setup
app.use(cors({
  origin: [process.env.PRODUCTION_ORIGIN, process.env.LOCAL_ORIGIN || 'http://localhost:3000'],
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Import and use journal routes
const journalRoutes = require('./routes/journal');
app.use('/api/journal', journalRoutes);

// Checkin routes
const checkinRouter = require('./routes/checkin');
app.use('/api/checkin', checkinRouter);

// Chat routes
const chatRoutes = require('./routes/chat'); // Create a chat.js file in the routes folder
app.use('/api/forum', chatRoutes);

// Route to update the home page current streak state
app.get('/api/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { updatedFields, currentStreak } = await updateState(id);
    await knex('users').where({ id }).update(updatedFields);

    res.status(200).send({ message: 'State updated', current_streak: currentStreak });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});

// Route to handle state update
app.post('/api/updateState/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await updateState(userId);
    res.json(result); // Send the result back to the client
  } catch (error) {
    console.error('Error updating state:', error);
    res.status(500).json({ error: 'Failed to update state' });
  }
});

app.get('/api/random-message/:streak', async (req, res) => {
  const { streak } = req.params;
  const streakNumber = parseInt(streak, 10);

  try {
    let messages;

    if (streakNumber <= 50) {
      messages = await knex('positive_reinforcement_messages')
        .where('streak_number', streakNumber);
    } else {
      messages = await knex('positive_reinforcement_messages')
        .where('streak_number', -1);
    }

    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found.' });
    }

    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];

    res.status(200).json({ message: randomMessage.message });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message.' });
  }
});

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

// Create HTTP server and bind it to the app
const httpServer = createServer(app);

// Set up WebSocket server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.PRODUCTION_ORIGIN || 'http://localhost:3000',
  },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Make io instance available in chat routes
app.set('io', io);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});