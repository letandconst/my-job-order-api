const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } = require('../../services/auth.service');
const User = require('../../models/User');

const userResolvers = {
	Query: {
		me: async (_, __, { user }) => {
			try {
				if (!user) return { success: false, message: 'Not authenticated', user: null };

				const fullUser = await User.findById(user.id);

				if (!fullUser) return { success: false, message: 'User not found', user: null };

				return { success: true, message: 'User retrieved successfully', user: fullUser };
			} catch (err) {
				return { success: false, message: err.message, user: null };
			}
		},
		users: async () => {
			try {
				const users = await User.find();
				return { success: true, message: 'Users retrieved successfully', users };
			} catch (err) {
				return { success: false, message: err.message, users: [] };
			}
		},
	},
	Mutation: {
		register: async (_, args) => registerUser(args),
		login: async (_, args) => {
			if (!args.email && !args.username) {
				return { success: false, message: 'Please enter either email or username' };
			}
			return loginUser(args);
		},
		forgotPassword: async (_, args) => forgotPassword(args),
		resetPassword: async (_, args) => resetPassword(args),
		updateProfile: async (_, args, context) => {
			if (!context.user) {
				return { success: false, message: 'Unauthorized' };
			}

			return await updateProfile(context.user.id, args);
		},
	},
};

module.exports = userResolvers;
