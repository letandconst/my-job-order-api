const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { registerSchema, loginSchema, updateProfileSchema } = require('../validators/userValidator');
const { sendTemplateMail } = require('../services/mail.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { GraphQLError } = require('graphql');
const { ApolloServerErrorCode } = require('@apollo/server/errors');

// Reset password token (separate purpose)
const generateResetToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// ----------------------
// Register User
// ----------------------
const registerUser = async ({ firstName, lastName, username, email, password, avatar }) => {
	await registerSchema.validate({ username, email, password, avatar });

	const existingUser = await User.findOne({ $or: [{ email }, { username }] });
	if (existingUser) {
		throw new GraphQLError('Email or Username already taken.', { extensions: { code: 'CONFLICT' } });
	}

	const user = await User.create({
		firstName,
		lastName,
		username,
		email,
		password,
		avatar: avatar || null,
	});

	const token = generateAccessToken(user);

	return { user, token, message: 'User registered successfully.' };
};

// ----------------------
// Login User
// ----------------------
const loginUser = async ({ email, username, password }, { res }) => {
	await loginSchema.validate({ email, username, password });

	if (!email && !username) {
		throw new GraphQLError('Please provide either an email or username.', { extensions: { code: 'BAD_USER_INPUT' } });
	}

	const user = await User.findOne({ $or: [{ email }, { username }] });
	if (!user) {
		throw new GraphQLError('No account found with this email or username.', { extensions: { code: 'NOT_FOUND' } });
	}

	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		throw new GraphQLError('Incorrect password.', { extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT } });
	}

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

	return { user, token: accessToken, message: 'Login successful.' };
};

// ----------------------
// Forgot Password
// ----------------------
const forgotPassword = async ({ email }) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new GraphQLError('No account found with this email.', { extensions: { code: 'NOT_FOUND' } });
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
		throw new GraphQLError('Failed to send reset email.', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
	}

	return { message: 'Password reset link sent to your email.' };
};

// ----------------------
// Reset Password
// ----------------------
const resetPassword = async ({ token, newPassword }) => {
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new GraphQLError('Invalid or expired reset token.', { extensions: { code: 'UNAUTHENTICATED' } });
	}

	const user = await User.findById(decoded.id);
	if (!user) {
		throw new GraphQLError('Invalid or expired reset token.', { extensions: { code: 'NOT_FOUND' } });
	}

	user.password = newPassword;
	await user.save();

	return { message: 'Password reset successful.' };
};

// ----------------------
// Update Profile
// ----------------------
const updateProfile = async (userId, args) => {
	await updateProfileSchema.validate(args);

	const user = await User.findById(userId);
	if (!user) {
		throw new GraphQLError('User not found.', { extensions: { code: 'NOT_FOUND' } });
	}

	let updatedSensitive = false;

	if (args.email && args.email !== user.email) {
		const existingUser = await User.findOne({ email: args.email });
		if (existingUser) {
			throw new GraphQLError('Email already exists.', { extensions: { code: 'CONFLICT' } });
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

	return { user, token, message: 'Profile updated successfully.' };
};

// ----------------------
// Verify Token
// ----------------------
const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		throw new GraphQLError('Session expired or invalid token.', {
			extensions: { code: ApolloServerErrorCode.AUTHENTICATION_FAILED },
		});
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
