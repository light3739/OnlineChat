import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import './Chat.css';

const Chat = ({ user, onLogout, typing, message, onSendMessage, onTextChange }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected!');
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected!');
        });

        newSocket.on('message', (data) => {
            setMessages((prevState) => [...prevState, data]);
        });

        newSocket.on('typing', (data) => {
            onTextChange(data);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [onTextChange]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message) {
            const timestamp = new Date().toISOString();
            socket.emit('message', { text: message, user: user, timestamp });
            console.log('Message:', message);

            fetch('http://localhost:5000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message, user: user, timestamp }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Message sent successfully:', data);
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });

            onSendMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat App</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <Message key={message.id} message={message} currentUser={user} />
                ))}
                {typing && <div className="typing-indicator">{`${user} is typing...`}</div>}
            </div>
            <form onSubmit={handleSendMessage} className="send-message-form">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => onTextChange(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
