import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import styles from './Chat.module.css';


const Chat = ({  onLogout, typing, message, onTextChange }) => {
    const user = localStorage.getItem('user')
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const messagesContainerRef = useRef(null);
    const fetchMessages = () => {
        fetch('http://localhost:5000/messages')
            .then((response) => response.json())
            .then((data) => setMessages(data))
            .catch((error) => console.error('Error fetching messages:', error));
    };
    useEffect(() => {

        // Create a socket connection to the server
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Clean up the socket connection when the component unmounts
        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if (socket) {

            // Listen to the 'message' event to receive new messages in real-time
            socket.on('message', (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }
    }, [socket]);

    const handleTextChange = (event) => {
        setInputValue(event.target.value);
        onTextChange(event);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();

        const newMessage = {
            text: inputValue,
            user: user,
            timestamp: new Date().toISOString(),
        };
        setInputValue('');
        socket.emit('message', newMessage, () => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

    };


    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

        return (
            <div className={styles.container}>
                <div className={styles['chat-container']}>
                    <div className={styles['chat-header']}>
                        <h1>Welcome, {user}</h1>
                        <button onClick={onLogout}>Logout</button>
                    </div>
                    <div ref={messagesContainerRef} className={styles['messages-container']}>
                        {messages.map((message) => (
                            <Message key={message.id} text={message.text} user={message.user} timestamp={message.timestamp} />
                        ))}
                        {typing && <div className={styles['typing-indicator']}>{`${typing} is typing...`}</div>}
                    </div>

                    <form onSubmit={handleSendMessage} className={styles['send-message-form']}>
                        <input type="text" placeholder="Type a message" value={inputValue} onChange={handleTextChange} />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        );
    };

    export default Chat;
