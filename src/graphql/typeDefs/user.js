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

	"""
	Generic response wrapper for all services.
	"""
	type BaseResponse {
		statusCode: Int!
		message: String!
		data: JSON
	}

	# Scalars
	scalar JSON

	extend type Query {
		me: BaseResponse!
		users: BaseResponse!
	}

	extend type Mutation {
		register(firstName: String!, lastName: String!, username: String!, email: String!, password: String!, avatar: String): BaseResponse
		login(email: String, username: String, password: String!): BaseResponse
		refreshToken: BaseResponse
		logout: BaseResponse
		forgotPassword(email: String!): BaseResponse
		resetPassword(token: String!, newPassword: String!): BaseResponse
		updateProfile(email: String, avatar: String, password: String): BaseResponse
	}
`;

module.exports = userTypeDefs;
