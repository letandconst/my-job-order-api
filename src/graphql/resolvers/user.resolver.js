const { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } = require('../../services/auth.service');

const userResolvers = {
	Query: {
		me: async (_, __, { user }) => {
			if (!user) throw new Error('Not authenticated');
			return user;
		},
		users: async () => {
			const User = require('../../models/User');
			return await User.find();
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
