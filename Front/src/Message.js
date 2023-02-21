import React from 'react';

const Message = ({ text, user, timestamp }) => {
    return (
        <div className="message-container">
            <div className="message-user">{user}</div>
            <div className="message-text">{text}</div>
            <div className="message-timestamp">{timestamp}</div>
        </div>
    );
};

export default Message;
