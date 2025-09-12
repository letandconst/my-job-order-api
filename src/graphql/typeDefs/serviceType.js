const { gql } = require('graphql-tag');

const serviceTypeDefs = gql`
	type ServiceType {
		id: ID!
		name: String!
		description: String
		category: String!
		isActive: Boolean!
		amount: Float!
		createdAt: String!
		updatedAt: String!
	}

	input CreateServiceTypeInput {
		name: String!
		description: String
		category: String!
		isActive: Boolean
		amount: Float!
	}

	extend type Query {
		services: BaseResponse!
		service(id: ID!): BaseResponse!
	}

	extend type Mutation {
		createServiceType(input: CreateServiceTypeInput!): BaseResponse!
		updateServiceType(id: ID!, name: String, description: String, category: String, isActive: Boolean, amount: Float): BaseResponse!
		deleteServiceType(id: ID!): BaseResponse!
	}
`;

module.exports = serviceTypeDefs;
