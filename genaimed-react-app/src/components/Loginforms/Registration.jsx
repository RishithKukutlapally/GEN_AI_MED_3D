import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Loginform.css';

const Registration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: '',
        method: 'phone',
    });
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSendOtp = async (e) => {
        e.preventDefault();
        const { phone, email, method } = formData;

        try {
            const response = await fetch("http://localhost:5050/auth/sendotp", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, email, method })
            });
            const result = await response.json();

            if (result.success) {
                setOtpSent(true);
                toast.success(`OTP sent to your ${method}`);
            } else {
                toast.error('Failed to send OTP');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error sending OTP');
        }
    };
    const handleVerifyOtp = async () => {
        const { name,phone, email, password, otp, method } = formData;
        try {
            const response = await fetch("http://localhost:5050/auth/verifyotp", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, password, otp, method })
            });
            const result = await response.json();

            if (result.success) {
                toast.success('OTP verified successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error('Invalid OTP');
            }
        } catch (err) {
            toast.error('Error verifying OTP');
        }
    };
    const handleError = (message) => {
        toast.error(message);
    };

    const handleSuccess = (message) => {
        toast.success(message);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, phone, password, confirmPassword } = formData;

        // Check if all fields are filled
        if (!name || !email || !phone || !password || !confirmPassword) {
            return handleError('All fields are required');
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return handleError('Passwords do not match');
        }

        try {
            const url = "http://localhost:5050/register";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, password })
            });

            const result = await response.json();

            // Check the response status for success or errors
            if (response.status === 200) {
                handleSuccess('Registration successful!');
                setTimeout(() => {
                    navigate('/login');  // Redirect to login page after successful registration
                }, 1000);
            } else if (response.status === 422) {
                handleError(result.error || 'User already exists');
            } else {
                handleError('An error occurred. Please try again.');
            }

        } catch (err) {
            handleError('An unexpected error occurred.');
        }
    };

    return (
        <div className="wrapper">
            <div className="form-container">
                <form onSubmit={handleSignup}>
                    <h1 className="hello">Registration</h1>
                    <div className="input-box">
                        <input
                            name='name'
                            type="text"
                            placeholder="Username"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            name='email'
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <FaEnvelope className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            name='phone'
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <FaPhone className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            name='password'
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            name='confirmPassword'
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className="icon" />
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" required /> I agree to the Terms and Conditions
                        </label>
                    </div>
                    <button type="submit">Register</button>
                    <div className="register-link">
                        <p>
                            Already have an account? <a href="/login">Login</a>
                        </p>
                        <label>
                    <input type="radio" name="method" value="phone" checked={formData.method === 'phone'} onChange={handleChange} />
                    Send OTP to Phone
                </label>
                <label>
                    <input type="radio" name="method" value="email" checked={formData.method === 'email'} onChange={handleChange} />
                    Send OTP to Email
                </label>

                {!otpSent && <button type="button" onClick={handleSendOtp}>Send OTP</button>}

                {otpSent && (
                    <>
                        <input name="otp" value={formData.otp} onChange={handleChange} placeholder="Enter OTP" />
                        <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
                    </>
                )}
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Registration;
