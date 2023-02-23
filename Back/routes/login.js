const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { generateUniqueKey } = require('./register');

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by their username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare the entered password with the hash stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a new JWT token for the user
        const token = jwt.sign({ id: user._id, timestamp: Date.now() }, user.secretKey);

        // Update the token in the database
        user.token = token;
        await user.save();

        // Send the token back to the client
        res.cookie('token', token);
        res.status(200).json({ success: true , token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
