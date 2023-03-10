import socketIOClient from 'socket.io-client';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
const ENDPOINT = 'http://localhost:5000';

export const handleLogin = (username, password, setUser, setIsAuthenticated, setError) => {
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then((data) => {
            const token = data.token;
            if (!token) {
                throw new Error('No token received');
            }
            localStorage.setItem('user', username);
            localStorage.setItem('token', token);
            setUser(username);
            setIsAuthenticated(true);
            // set isAuthenticated to true
            // redirect user to chat page
        })
        .catch((error) => {
            console.error('Error:', error);
            setIsAuthenticated(false); // set isAuthenticated to false
            setError('Username or password is incorrect');
        });
};



export const handleLogout = (setUser) => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload()
};

export const handleRegister = (username, password, setRegistrationSuccess, navigate) => {
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
                localStorage.setItem('user', username);
                setRegistrationSuccess(true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

export const handleSendMessage = (user, message, setMessage) => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('message', { user, message });
    setMessage('');
};

export const handleTextChange = (user) => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit('typing', user);
};
