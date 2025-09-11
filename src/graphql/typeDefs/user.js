const { gql } = require('graphql-tag');

const userTypeDefs = gql`
	scalar Upload

	type User {
		id: ID!
		firstName: String!
		lastName: String!
		username: String!
		email: String!
		avatar: Upload
		createdAt: String
	}

	# General auth response
	type AuthResponse {
		success: Boolean!
		message: String!
		token: String
		user: User
	}

	extend type Query {
		me: User
		users: [User]
	}

	extend type Mutation {
		register(firstName: String!, lastName: String!, username: String!, email: String!, password: String!, avatar: String): AuthResponse

		login(email: String, username: String, password: String!): AuthResponse

		forgotPassword(email: String!): AuthResponse

		resetPassword(token: String!, newPassword: String!): AuthResponse

		updateProfile(email: String, avatar: Upload, password: String): AuthResponse
	}
`;

module.exports = userTypeDefs;
