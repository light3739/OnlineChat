import React, {useState, useEffect, Fragment} from 'react';
import socketIOClient from 'socket.io-client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import PrivateRoute from './PrivateRoute';
import {handleLogin, handleLogout, handleRegister} from './handlers';

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
        handleSendMessage(user, message, setMessage);
    };

    const handleTextChange = (event) => {
        setMessage(event.target.value);
        handleTextChange(user);
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
                    <Route exact path='/chat' element={<PrivateRoute/>}>
                        <Route exact path='/chat'
                               element={
                                   <Chat
                                       user={user}
                                       typing={typing}
                                       message={message}
                                       onSendMessage={handleSendMessage}
                                       onTextChange={handleTextChange}
                                       onLogout={() => handleLogout(setUser)}
                                   />
                               }
                               isAuthenticated={user !== null}
                        />
                    </Route>

                </Routes>
            </Fragment>
        </BrowserRouter>
    );
}

export default App;
