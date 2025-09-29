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

	type AuthPayload {
		user: User!
		token: String
		message: String
	}

	type SimpleMessage {
		message: String!
	}

	extend type Query {
		me: User!
		users: [User!]!
	}

	extend type Mutation {
		register(firstName: String!, lastName: String!, username: String!, email: String!, password: String!, avatar: String): AuthPayload!
		login(email: String, username: String, password: String!): AuthPayload!
		refreshToken: SimpleMessage!
		logout: SimpleMessage!
		forgotPassword(email: String!): SimpleMessage!
		resetPassword(token: String!, newPassword: String!): SimpleMessage!
		updateProfile(email: String, avatar: String, password: String): AuthPayload!
	}
`;

module.exports = userTypeDefs;
