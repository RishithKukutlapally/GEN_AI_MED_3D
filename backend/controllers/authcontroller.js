const User = require("../models/user");
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_ACCOUNT_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

let otpStorage = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: "GEN AI Med 3D",
        to: email,
        subject: 'OTP For Registration',
        text: `Your OTP code is ${otp}`
    };
    await transporter.sendMail(mailOptions);
};

const sendOtp = async (req, res) => {
    try {
        const { phone, email, method } = req.body;

        if (method === 'phone') {
            await client.verify.v2.services("VA4cb0659d345cceb14a82326ca8c50a56")
                .verifications.create({
                    to: `+91${phone}`,
                    channel: 'sms'
                });
            res.status(200).json({ message: 'OTP sent to your phone', success: true });
        } else if (method === 'email') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpStorage[email] = otp;
            await sendOtpEmail(email, otp);
            res.status(200).json({ message: 'OTP sent to your email', success: true, otp });
        }
    } catch (err) {
        console.error("Error sending OTP:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { phone, email, otp, method, name, password } = req.body;
        let isValidOtp = false;

        if (method === 'phone') {
            const verificationCheck = await client.verify.v2.services("VA4cb0659d345cceb14a82326ca8c50a56")
                .verificationChecks.create({
                    to: `+91${phone}`,
                    code: otp
                });

            if (verificationCheck.status !== 'approved') {
                return res.status(400).json({ message: "Invalid OTP", success: false });
            }
        } else if (method === 'email') {
            isValidOtp = otp === otpStorage[email];
            delete otpStorage[email];

            if (!isValidOtp) {
                return res.status(400).json({ message: "Invalid OTP", success: false });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", success: true });
    } catch (err) {
        console.error('Error during OTP verification:', err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const test = (req, res) => {
    res.json('test is working');
};

const getProfile = (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        });
    } else {
        res.json(null);
    }
};

module.exports = { sendOtp, verifyOtp, test, getProfile };
