import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import './Chat.css';

const Chat = ({ user, onLogout, typing, message, onSendMessage, onTextChange, isAuthenticated }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Create a socket connection to the server
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Fetch messages from the server and set the initial state
        fetch('http://localhost:5000/messages')
            .then((response) => response.json())
            .then((data) => setMessages(data))
            .catch((error) => console.error('Error fetching messages:', error));

        // Listen to the 'message' event to receive new messages in real-time
        newSocket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Clean up the socket connection when the component unmounts
        return () => newSocket.close();
    }, [messages]);

    const handleTextChange = (event) => {
        setInputValue(event.target.value);
        onTextChange(event);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        onSendMessage(event);
        setInputValue('');
    };

    if (!isAuthenticated) {
        window.location.reload()
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>{user}</h1>
                <button onClick={onLogout}>Logout</button>
            </div>
            <div className="messages-container">
                {messages.map((message) => (
                    <Message key={message.id} text={message.text} user={message.user} timestamp={message.timestamp} />
                ))}
                {typing && <div className="typing-indicator">{`${user} is typing...`}</div>}
            </div>

            <form onSubmit={handleSendMessage} className="send-message-form">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={inputValue}
                    onChange={handleTextChange}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
