const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } = require('../../services/auth.service');
const User = require('../../models/User');
const { formatResponse } = require('../../utils/response');

const userResolvers = {
	Query: {
		me: async (_, __, { user }) => {
			try {
				if (!user) {
					return formatResponse(401, 'Not authenticated.');
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
		users: async () => {
			try {
				const users = await User.find();
				return formatResponse(200, 'Users retrieved successfully.', { users });
			} catch (err) {
				return formatResponse(500, err.message || 'Failed to fetch users.');
			}
		},
	},
	Mutation: {
		register: async (_, args) => registerUser(args),
		login: async (_, args) => loginUser(args),
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
