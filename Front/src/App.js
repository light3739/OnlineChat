import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import { handleLogin, handleLogout, handleRegister } from './handlers';

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
                                onLogout={() => handleLogout(setUser)}
                            />
                        ) : (
                            <Login onLogin={(username, password) => handleLogin(username, password, setUser)} />
                        )
                    }
                />
                <Route path="/register" element={<Register onRegister={(username, password) => handleRegister(username, password, setUser)} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
