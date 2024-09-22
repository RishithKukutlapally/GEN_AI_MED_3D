import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from './utils'; // Assuming these are helper functions you created
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './Loginform.css';

const Loginform = () => {
    const [loginInfo, setLoginInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { name, email, password } = loginInfo;

        if (!name || !email || !password) {
            return handleError('All fields are required');
        }

        try {
            const url = 'http://localhost:5050/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();

            // Check response from backend
            if (response.status === 200) {
                handleSuccess(result.message || 'Login successful!');
                localStorage.setItem('loggedInuser', result.user.name); // Store the user data
                setTimeout(() => {
                    navigate('/home'); // Redirect after successful login
                }, 1000);
            } else {
                handleError(result.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            handleError('An error occurred during login');
        }
    };

    return (
        <div className="wrapper">
            <div className="form-container">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            onChange={handleChange}
                            type="text"
                            placeholder="Username"
                            name="name"
                            required
                            value={loginInfo.name}
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            name="email"
                            required
                            value={loginInfo.email}
                        />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            name="password"
                            required
                            value={loginInfo.password}
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Loginform;
