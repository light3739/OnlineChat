import React, { useState } from 'react';

const MessageForm = ({ userName, onSendMessage, message, onMessageChange, disabled }) => {

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const trimmedMessage = message.trim();
        if (trimmedMessage.length > 0) {
            const data = {
                userName,
                text: trimmedMessage,
            };
            onSendMessage(data);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="message-form">
            <input
                type="text"
                value={message}
                onChange={onMessageChange}
                className="message-input"
                placeholder="Type your message here"
                maxLength="100"
            />
            <button type="submit" className="send-button" disabled={disabled}>Send</button>
        </form>
    );
};

export default MessageForm;
