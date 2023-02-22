const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.sendStatus(500);
    }
});

module.exports = router;
