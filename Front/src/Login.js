import React, { useState  } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './Login.css'
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setAuthenticated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password, setUsername, setAuthenticated);
    };


    return (
        <div className="login-container">
            <h1>Login</h1>
            {isAuthenticated ? (
                <Navigate to="/chat" />
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            )}
            <p>
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
        </div>
    );
};



export default Login;
