const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
