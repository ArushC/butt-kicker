const express = require('express');
const router = express.Router();
const knex = require('../knex');

// Endpoint to get chat messages
router.get('/:id', async (req, res) => {
  try {
    const messages = await knex('chat_messages')
      .join('users', 'chat_messages.user_id', '=', 'users.id')
      .select('chat_messages.*', 'users.username')
      .orderBy('timestamp', 'asc')
      .limit(100);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Endpoint to post a new chat message
router.post('/:id', async (req, res) => {
  const { user_id, anonymous, username, message } = req.body;
  const io = req.app.get('io'); // Get io instance from the app

  try {
    const [newMessage] = await knex('chat_messages')
      .insert({ user_id, anonymous, message })
      .returning('*');
    
    newMessage.username = username;

    io.emit('new_message', newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error posting message:', err);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

module.exports = router;
