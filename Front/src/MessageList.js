import React from 'react';
import moment from 'moment';

const MessageList = ({ messages }) => {
    return (
        <ul className="message-list">
            {messages.map((message, index) => (
                <li key={index} className="message">
                    <strong>{moment(message.timestamp).format('h:mm')} - {message.user}:</strong> {message.text}
                </li>
            ))}
        </ul>
    );
};


export default MessageList;
