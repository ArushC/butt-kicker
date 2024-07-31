const express = require('express');
const router = express.Router();
const knex = require('../knex'); // Update the path as necessary
const { Server } = require('socket.io');
const io = require('socket.io')(5001, {
  cors: {
    origin: "*"
  }
});

// Endpoint to get chat messages
router.get('/forum/:id', async (req, res) => {
    const messages = await knex('chat_messages')
      .join('users', 'chat_messages.user_id', '=', 'users.id') // Adjust this line according to your actual schema
      .select('chat_messages.*', 'users.username') // Select fields from chat_messages and the username
      .orderBy('timestamp', 'asc')
      .limit(100);
    res.json(messages);
  });

// Endpoint to post a new chat message
router.post('/forum/:id', async (req, res) => {
    const { user_id, anonymous, message } = req.body;
  
    try {
      // Fetch the username based on user_id
      const user = await knex('users').where({ id: user_id }).first();
      const username = anonymous ? 'Anonymous' : user.username;
  
      // Insert the new message into the database
      const [newMessage] = await knex('chat_messages')
        .insert({ user_id, anonymous, message, username })
        .returning('*');
  
      // Emit the new message to all connected clients
      io.emit('new_message', newMessage);
      res.status(201).json(newMessage);
    } catch (err) {
      console.error('Error posting message:', err);
      res.status(500).json({ error: 'Failed to post message' });
    }
  });

module.exports = router;