const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { v4: uuidv4 } = require('uuid');

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
                id: uuidv4(),
                user: req.body.user,
                text: req.body.text,
                timestamp: req.body.timestamp
            });
            const savedMessage = await message.save();
            io.emit('message', savedMessage); // emit the message to all clients
            res.json(savedMessage);
        } catch (error) {
            console.error('Error saving message:', error);
            res.sendStatus(500);
        }
    });

    // Listen to the 'message' event to receive new messages in real-time
    io.on('connection', (socket) => {
        console.log(`User ${socket.id} connected`);
        socket.on('message', async (newMessage) => {
            try {
                const message = new Message({
                    id: uuidv4(),
                    user: newMessage.user,
                    text: newMessage.text,
                    timestamp: newMessage.timestamp
                });
                const savedMessage = await message.save();
                io.emit('message', savedMessage); // emit the message to all clients
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.id} disconnected`);
        });
    });

    return router;
};
