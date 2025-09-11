const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { uploadImage } = require('./upload.service');
const { registerSchema, loginSchema, updateProfileSchema } = require('../utils/validators');

const generateToken = (user) => {
	return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateResetToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const registerUser = async ({ username, email, password, avatar }) => {
	try {
		await registerSchema.validate({ username, email, password, avatar });

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return { success: false, message: 'Email or Username already taken.' };
		}

		let avatarUrl = null;
		if (avatar) {
			const uploadResult = await uploadImage(avatar, 'avatars');
			avatarUrl = uploadResult.secure_url;
		}

		const user = await User.create({
			username,
			email,
			password,
			avatar: avatarUrl,
		});

		const token = generateToken(user);

		return {
			success: true,
			message: 'User registered successfully',
			token,
			user,
		};
	} catch (err) {
		return { success: false, message: err.message || 'Registration failed' };
	}
};

const loginUser = async ({ email, username, password }) => {
	try {
		await loginSchema.validate({ email, username, password });

		if (!email && !username) {
			return { success: false, message: 'Please provide email or username.' };
		}

		const user = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (!user) {
			return { success: false, message: 'No account found with this email or username.' };
		}

		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return { success: false, message: 'Incorrect password.' };
		}

		const token = generateToken(user);

		return {
			success: true,
			message: 'Login successful',
			token,
			user,
		};
	} catch (err) {
		return { success: false, message: err.message || 'Login failed' };
	}
};

const forgotPassword = async ({ email }) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return { success: false, message: 'No account found with this email' };
		}

		const resetToken = generateResetToken(user);

		// TODO: send email with reset link (later with mailerService)
		// For now, just return token for testing
		return {
			success: true,
			message: 'Password reset token generated',
			token: resetToken,
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			message: 'Failed to generate reset token',
		};
	}
};

const resetPassword = async ({ token, newPassword }) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user) {
			return { success: false, message: 'Invalid or expired token' };
		}

		user.password = newPassword;
		await user.save();

		return {
			success: true,
			message: 'Password reset successful',
		};
	} catch (err) {
		console.error(err);
		return {
			success: false,
			message: 'Password reset failed. Token may be invalid or expired.',
		};
	}
};

const updateProfile = async (userId, args) => {
	try {
		// ✅ Validate with Yup
		await updateProfileSchema.validate(args);

		const user = await User.findById(userId);
		if (!user) {
			return { success: false, message: 'User not found.' };
		}

		if (args.email) user.email = args.email;
		if (args.password) user.password = args.password;

		if (args.avatar) {
			const uploadResult = await uploadImage(args.avatar, 'avatars');
			user.avatar = uploadResult.secure_url;
		}

		await user.save();

		return {
			success: true,
			message: 'Profile updated successfully',
			user,
		};
	} catch (err) {
		return { success: false, message: err.message || 'Profile update failed' };
	}
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		return null;
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
