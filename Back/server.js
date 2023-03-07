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
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Set the strictQuery option to false
mongoose.set('strictQuery', false);

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/chat');

// Set up the WebSocket connection
const server = app.listen(5000, () => {
    console.log('Server listening on port 5000');
});

const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins
    },
});

io.on('connection', (socket) => {

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

const messageRoutes = require('./routes/messages')(io); // pass io object
const userRoutes = require('./routes/login');
const registerRouter = require('./routes/register');
app.use('/messages', messageRoutes);
app.use('/login', userRoutes);
app.use('/register', registerRouter);

// Middleware ?


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack); //example
    res.status(500).send('Something broke!');
});
