import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Chat from './Chat';
import Register from './Register';

const ENDPOINT = 'http://localhost:5000';

function App() {
    const [user, setUser] = useState(localStorage.getItem('user') || null);
    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on('typing', (data) => {
            setTyping(data);
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        localStorage.setItem('user', user);
    }, [user]);

    const handleLogin = (username) => {
        setUser(username);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleRegister = (username, password) => {
        fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok');
            })
            .then((data) => {
                if (data.success) {
                    setUser(username);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleSendMessage = (message) => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('message', { user, message });
        setMessage('');
    };

    const handleTextChange = (event) => {
        setMessage(event.target.value);
        const socket = socketIOClient(ENDPOINT);
        socket.emit('typing', user);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        user ? (
                            <ChatPage
                                user={user}
                                typing={typing}
                                message={message}
                                onSendMessage={handleSendMessage}
                                onTextChange={handleTextChange}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={<RegisterPage onRegister={handleRegister} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

function ChatPage({ user, typing, message, onSendMessage, onTextChange, onLogout }) {
    return <Chat user={user} typing={typing} message={message} onSendMessage={onSendMessage} onTextChange={onTextChange} onLogout={onLogout} />;
}

function LoginPage({ onLogin }) {
    return <Login onLogin={onLogin} />;
}

function RegisterPage({ onRegister }) {
    return <Register onRegister={onRegister} />;
}

export default App;
