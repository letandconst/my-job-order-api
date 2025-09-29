const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } = require('../../services/auth.service');
const User = require('../../models/User');
const { GraphQLError } = require('graphql');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../utils/token');

const userResolvers = {
	Query: {
		me: async (_, __, { user }) => {
			if (!user) {
				throw new GraphQLError('Session expired.', {
					extensions: { code: ApolloServerErrorCode.AUTHENTICATION_FAILED },
				});
			}

			const fullUser = await User.findById(user.id);
			if (!fullUser) {
				throw new GraphQLError('User not found.', {
					extensions: { code: 'NOT_FOUND' },
				});
			}

			return fullUser;
		},

		users: async () => {
			const users = await User.find();
			return users;
		},
	},

	Mutation: {
		register: (_, args) => registerUser(args),
		login: (_, args, { res }) => loginUser(args, { res }),
		refreshToken: async (_, __, { req, res }) => {
			try {
				const token = req.cookies.refreshToken;
				if (!token) throw new AuthenticationError('No refresh token found.');

				const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
				if (!decoded?.id || !decoded?.email) {
					throw new AuthenticationError('Invalid refresh token.');
				}

				const newAccessToken = generateAccessToken({
					_id: decoded.id,
					email: decoded.email,
				});

				// set new access token cookie
				res.cookie('accessToken', newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'strict',
					maxAge: 15 * 60 * 1000, // 15 min
				});

				return { success: true, message: 'Access token refreshed.' };
			} catch (err) {
				throw new AuthenticationError('Session expired. Please log in again.');
			}
		},

		logout: (_, __, { res }) => {
			res.clearCookie('accessToken');
			res.clearCookie('refreshToken');
			return { message: 'Logged out successfully' };
		},

		forgotPassword: (_, args) => forgotPassword(args),
		resetPassword: (_, args) => resetPassword(args),

		updateProfile: (_, args, { user }) => {
			if (!user) {
				throw new GraphQLError('Unauthorized.', {
					extensions: { code: ApolloServerErrorCode.AUTHENTICATION_FAILED },
				});
			}
			return updateProfile(user.id, args);
		},
	},
};

module.exports = userResolvers;
