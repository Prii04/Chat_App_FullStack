// To handle errors in this automatically we have a package called express-async-handler.
const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const generateToken = require('../config/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail', // or your email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields");
    }
    // if any of these is undefined or empty, we throw an error

    //check if user already exists and query the database
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    //create a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), //generate a token for the user
        }) //after registration, send a jwt token to the user
    }
    else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id), //generate a token for the user
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// /api/user?search=piyush
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); //exclude the current user from the list
    res.send(users);
});

// Forgot Password Controller
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide email address");
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found with this email address");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save to user
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set token expiration (10 minutes)
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    // Save to user document
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email message
    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>You requested a password reset for your account. Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            <p><strong>This link will expire in 10 minutes.</strong></p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    `;

    try {
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"${process.env.APP_NAME || 'Chat App'}" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: message,
        });

        res.status(200).json({
            success: true,
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.error("Email sending error:", error);

        // Clear reset token if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500);
        throw new Error("Email could not be sent. Please try again later.");
    }
});

// Reset Password Controller
const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        res.status(400);
        throw new Error("Please provide token and new password");
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters long");
    }

    // Hash token to compare with database
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // Find user by token and check expiration
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error("Invalid or expired reset token");
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
        },
    });
});

module.exports = { 
    registerUser, 
    authUser, 
    allUsers, 
    forgotPassword, 
    resetPassword 
};