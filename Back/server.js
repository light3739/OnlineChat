// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const User = require('./models/User');

// Set up the app
const app = express();
app.use(express.json());
app.use(cors());

// Set the strictQuery option to false
mongoose.set('strictQuery', false);

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/chat');

// Set up the WebSocket connection
const server = app.listen(5000, () => {
    console.log('Server listening on port 5000');
});
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('message', async (data) => {
        console.log('Message received:', data);
        const message = new Message({
            user: data.user,
            text: data.text,
            timestamp: new Date(),
        });
        try {
            const savedMessage = await message.save();
            io.emit('message', savedMessage);
        } catch (error) {
            console.log('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Routes
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const registerRouter = require('./routes/register');
app.use('/messages', messageRoutes);
app.use('/users', userRoutes);
app.use('/register', registerRouter);

// Middleware
const authenticateUser = require('./middleware/authenticateUser');
app.use(authenticateUser);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
