import React, {useState} from 'react';
import {Link, useNavigate, Navigate} from 'react-router-dom';

const Register = ({onRegister}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            onRegister(username, password, setRegistrationSuccess);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {registrationSuccess ? (
                <div>
                    <p>Registration successful! Please log in. </p>
                    <Navigate to="/" replace={true}/>

                </div>
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
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit">Register</button>
                </form>
            )}
            <p>
                Already have an account?{' '}
                <Link to="/">Login</Link>
            </p>
        </div>
    );
};

export default Register;
