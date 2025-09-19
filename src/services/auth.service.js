const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/userValidator');
const { formatResponse } = require('../utils/response');
const { sendTemplateMail } = require('../services/mail.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { AuthenticationError } = require('@apollo/server');

// Reset password token (separate purpose)
const generateResetToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// ----------------------
// Register User
// ----------------------

const registerUser = async ({ firstName, lastName, username, email, password, avatar }) => {
	try {
		await registerSchema.validate({ username, email, password, avatar });

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return formatResponse(409, 'Email or Username already taken.');
		}

		let avatarUrl = null;
		if (avatar) {
			avatarUrl = avatar;
		}

		const user = await User.create({
			firstName,
			lastName,
			username,
			email,
			password,
			avatar: avatarUrl,
		});

		const token = generateToken(user);

		return formatResponse(201, 'User registered successfully.', { user, token });
	} catch (err) {
		return formatResponse(400, err.message || 'Registration failed.');
	}
};

// ----------------------
// Login User
// ----------------------

const loginUser = async ({ email, username, password }, { res }) => {
	try {
		// Validate input
		await loginSchema.validate({ email, username, password });

		if (!email && !username) {
			return formatResponse(400, 'Please provide either an email or username.');
		}

		// Find user by email or username
		const user = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (!user) {
			return formatResponse(404, 'No account found with this email or username.');
		}

		// Validate password
		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return formatResponse(401, 'Incorrect password.');
		}

		// Generate tokens
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		// Store tokens in cookies
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000, // 15 min
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});

		// Return user info only
		return formatResponse(200, 'Login successful.', { user });
	} catch (err) {
		return formatResponse(400, err.message || 'Login failed.');
	}
};

// ----------------------
// Forgot Password
// ----------------------

const forgotPassword = async ({ email }) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return formatResponse(404, 'No account found with this email.');
		}

		const resetToken = generateResetToken(user);
		const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

		// send using Brevo template
		const mailResult = await sendTemplateMail({
			to: user.email,
			templateId: parseInt(process.env.BREVO_RESET_TEMPLATE_ID),
			params: {
				FIRSTNAME: user.firstName,
				RESET_LINK: resetLink,
			},
		});

		if (!mailResult.success) {
			return formatResponse(500, 'Failed to send reset email.');
		}

		return formatResponse(200, 'Password reset link sent to your email.');
	} catch (err) {
		return formatResponse(500, err.message || 'Failed to generate reset token.');
	}
};

// ----------------------
// Reset Password
// ----------------------

const resetPassword = async ({ token, newPassword }) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) {
			return formatResponse(400, 'Invalid or expired token.');
		}

		user.password = newPassword;
		await user.save();

		return formatResponse(200, 'Password reset successful.');
	} catch (err) {
		return formatResponse(400, err.message || 'Password reset failed. Token may be invalid or expired.');
	}
};
// ----------------------
// Update Profile
// ----------------------

const updateProfile = async (userId, args) => {
	try {
		await updateProfileSchema.validate(args);

		const user = await User.findById(userId);
		if (!user) {
			return formatResponse(404, 'User not found.');
		}

		let updatedSensitive = false;

		if (args.email && args.email !== user.email) {
			const existingUser = await User.findOne({ email: args.email });
			if (existingUser) {
				return formatResponse(409, 'Email already exists.');
			}
			user.email = args.email;
			updatedSensitive = true;
		}

		if (args.password) {
			user.password = args.password;
			updatedSensitive = true;
		}

		if ('avatar' in args) {
			user.avatar = args.avatar ?? null;
		}

		await user.save();

		let token = null;
		if (updatedSensitive) {
			token = generateAccessToken(user);
		}

		return formatResponse(200, 'Profile updated successfully.', { user, token });
	} catch (err) {
		return formatResponse(400, err.message || 'Profile update failed.');
	}
};

// ----------------------
// Verify Token
// ----------------------

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new AuthenticationError('Session expired or invalid token');
	}
};

module.exports = {
	registerUser,
	loginUser,
	forgotPassword,
	resetPassword,
	verifyToken,
	updateProfile,
};
