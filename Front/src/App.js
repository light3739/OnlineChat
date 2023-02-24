import React, { useState, useEffect, Fragment } from 'react';
import socketIOClient from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import PrivateRoute from './PrivateRoute';
import { handleLogin, handleLogout, handleRegister } from './handlers';

const ENDPOINT = 'http://localhost:5000';
const socket = socketIOClient(ENDPOINT);

function App() {
    const [user, setUser] = useState(localStorage.getItem('user') || '');
    const [typing, setTyping] = useState(false);
    const [message, setMessage] = useState('');



    useEffect(() => {
        socket.on('typing', (data) => {
            setTyping(data);
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        localStorage.setItem('user', user);
    }, [user]);

    const handleSendMessage = (event) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
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

        }
    };


    const handleTextChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Login
                                onLogin={(username, password, setUser, setIsAuthenticated) =>
                                    handleLogin(username, password, setUser, setIsAuthenticated)
                                }
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <Register
                                onRegister={(username, password, setRegistrationSuccess, navigate) =>
                                    handleRegister(username, password, setRegistrationSuccess, navigate)
                                }
                            />
                        }
                    />
                    <Route
                        exact
                        path="/chat"
                        element={
                            <PrivateRoute>
                                <Chat
                                    isAuthenticated = {localStorage.getItem('user') !== null && localStorage.getItem('user') !==''}
                                    user={user}
                                    typing={typing}
                                    message={message}
                                    onSendMessage={handleSendMessage}
                                    onTextChange={handleTextChange}
                                    onLogout={() => handleLogout(setUser)}
                                />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Fragment>
        </BrowserRouter>
    );
}

export default App;
