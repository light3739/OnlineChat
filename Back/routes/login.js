const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by their username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a new token for the user
        const token = jwt.sign({ id: user._id }, user.secretKey);

        // Send the token back to the client
        res.cookie('token', token);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
