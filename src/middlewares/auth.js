const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async ({ req }) => {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.replace('Bearer ', '');

	if (!token) return { user: null };

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		return { user };
	} catch (err) {
		return { user: null };
	}
};

module.exports = { authMiddleware };
