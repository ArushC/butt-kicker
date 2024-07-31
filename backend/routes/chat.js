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
      .orderBy('timestamp', 'desc')
      .limit(100);
    res.json(messages);
  });

// Endpoint to post a new chat message
router.post('/forum/:id', async (req, res) => {
  const { user_id, anonymous, message } = req.body;
  const [newMessage] = await knex('chat_messages')
    .insert({ user_id, anonymous, message })
    .returning('*');
  io.emit('new_message', newMessage); // Emit the new message to all connected clients
  res.status(201).json(newMessage);
});

module.exports = router;