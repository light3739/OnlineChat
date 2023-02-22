const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const express = require("express");
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });

        // Save the user to the database
        const savedUser = await user.save();

        // Generate a JWT token for the user
        const token = jwt.sign({ id: savedUser._id }, 'secret');

        // Send the token back to the client
        res.cookie('token', token);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;