const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

module.exports = function(io) {
    router.get('/', async (req, res) => {
        try {
            const messages = await Message.find({});
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.sendStatus(500);
        }
    });

    router.post('/', async (req, res) => {
        try {
            if (!req.body.user || !req.body.text || !req.body.timestamp) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const message = new Message({
                user: req.body.user,
                text: req.body.text,
                timestamp: req.body.timestamp
            });
            const savedMessage = await message.save();
            io.emit('message', savedMessage);
            res.json(savedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
            res.sendStatus(500);
        }
    });


    return router;
};
