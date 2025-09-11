const { gql } = require('graphql-tag');

const userTypeDefs = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		username: String!
		email: String!
		avatar: String
		createdAt: String
	}

	# General auth response
	type AuthResponse {
		success: Boolean!
		message: String!
		token: String
		user: User
	}

	type UserResponse {
		success: Boolean!
		message: String!
		user: User
	}

	type UsersResponse {
		success: Boolean!
		message: String!
		users: [User!]
	}

	extend type Query {
		me: UserResponse!
		users: UsersResponse!
	}

	extend type Mutation {
		register(firstName: String!, lastName: String!, username: String!, email: String!, password: String!, avatar: String): AuthResponse

		login(email: String, username: String, password: String!): AuthResponse

		forgotPassword(email: String!): AuthResponse

		resetPassword(token: String!, newPassword: String!): AuthResponse

		updateProfile(email: String, avatar: String, password: String): AuthResponse
	}
`;

module.exports = userTypeDefs;
