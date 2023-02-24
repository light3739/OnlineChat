import React from 'react';

const Message = ({ id, text, user, timestamp }) => {
    console.log('Rendering message:', { text, user, timestamp }); // Add this line to check the props
    const formattedTimestamp = new Date(timestamp).toLocaleString();
    return (
        <div key={id} className="message-container">
            <div className="message-user">{user}</div>
            <div className="message-text">{text}</div>
            <div className="message-timestamp">{formattedTimestamp}</div>
        </div>
    );
};


export default Message;
