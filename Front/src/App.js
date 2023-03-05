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
        const [user, setUser] = useState(localStorage.getItem('user') || null);
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




        const handleTextChange = (event) => {
            setMessage(event.target.value);
        };

        return (
            <BrowserRouter>
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
                                        user={user}
                                        typing={typing}
                                        message={message}
                                        onTextChange={handleTextChange}
                                        onLogout={() => handleLogout(setUser)}
                                    />

                                </PrivateRoute>
                            }
                        />
                    </Routes>
            </BrowserRouter>
        );
    }

    export default App;
