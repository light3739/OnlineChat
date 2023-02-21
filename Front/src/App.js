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
                            <Chat
                                user={user}
                                typing={typing}
                                message={message}
                                onSendMessage={handleSendMessage}
                                onTextChange={handleTextChange}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={<Register onRegister={handleRegister} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
