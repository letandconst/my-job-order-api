const jwt = require('jsonwebtoken');

// ----------------------
// Token Helpers
// ----------------------

// Short-lived access token (used for auth on each request)
const generateAccessToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: '15m' } // access expires quickly
	);
};

// Long-lived refresh token (used only to reissue access tokens)
const generateRefreshToken = (user) => {
	return jwt.sign(
		{ id: user._id },
		process.env.JWT_REFRESH_SECRET, // 🔑 use a different secret
		{ expiresIn: '7d' } // longer lifespan
	);
};

// Reset password token (separate purpose)
const generateResetToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	generateResetToken,
};
