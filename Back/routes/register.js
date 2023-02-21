const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ username, password: hashedPassword });

        // Save the user to the database
        await user.save()
            .then(savedUser => {
            console.log(`User ${savedUser.username} saved to the database!`);
        })
            .catch(error => {
                console.error('Error saving user:', error);
            });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
