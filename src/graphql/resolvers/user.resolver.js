const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } = require('../../services/auth.service');
const User = require('../../models/User');
const { formatResponse } = require('../../utils/response');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
const { GraphQLError } = require('graphql');

const userResolvers = {
	Query: {
		me: async (_, __, { user }) => {
			try {
				if (!user) {
					throw new GraphQLError('Session expired.', {
						extensions: {
							code: ApolloServerErrorCode.AUTHENTICATION_FAILED,
						},
					});
				}

				const fullUser = await User.findById(user.id);
				if (!fullUser) {
					return formatResponse(404, 'User not found.');
				}

				return formatResponse(200, 'User retrieved successfully.', { user: fullUser });
			} catch (err) {
				return formatResponse(500, err.message || 'Failed to fetch user.');
			}
		},
		listUsers: async () => {
			try {
				const users = await User.find();
				return formatResponse(200, 'Users retrieved successfully.', users);
			} catch (err) {
				return formatResponse(500, err.message || 'Failed to fetch users.');
			}
		},
	},
	Mutation: {
		register: async (_, args) => registerUser(args),
		login: async (_, args, { res }) => loginUser(args, { res }),
		refreshToken: async (_, __, { req, res }) => {
			try {
				const token = req.cookies.refreshToken;
				if (!token) {
					throw new AuthenticationError('No refresh token found. Please log in again.');
				}

				const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

				if (!decoded || !decoded.id || !decoded.email) {
					throw new AuthenticationError('Invalid token payload.');
				}

				const newAccessToken = generateAccessToken({
					_id: decoded.id,
					email: decoded.email,
				});

				res.cookie('accessToken', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 15 * 60 * 1000, // 15 min
				});

				return formatResponse(200, 'Access token refreshed.');
			} catch (err) {
				throw new AuthenticationError('Invalid or expired refresh token. Please log in again.');
			}
		},
		logout: async (_, __, { res }) => {
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			return formatResponse(200, 'Logged out successfully');
		},
		forgotPassword: async (_, args) => forgotPassword(args),
		resetPassword: async (_, args) => resetPassword(args),
		updateProfile: async (_, args, { user }) => {
			if (!user) {
				return formatResponse(401, 'Unauthorized.');
			}
			return updateProfile(user.id, args);
		},
	},
};

module.exports = userResolvers;
