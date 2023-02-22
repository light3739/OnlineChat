const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique secret key for the user
        const secretKey = generateUniqueKey();

        // Create a new user
        const user = new User({ username, password: hashedPassword, token: '', secretKey });

        // Save the user to the database
        const savedUser = await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign({ id: savedUser._id }, secretKey);

        // Update the token for the user
        savedUser.token = token;
        await savedUser.save();

        // Send the token back to the client
        res.cookie('token', token);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to generate a unique secret key for a user
function generateUniqueKey() {
    // Use a library like uuid to generate a unique key
    return uuidv4();
}

module.exports = router;
