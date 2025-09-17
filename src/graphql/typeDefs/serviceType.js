const { gql } = require('graphql-tag');

const serviceTypeDefs = gql`
	type AmountPerCarType {
		sedan: Float
		hatchback: Float
		crossover: Float
		suv: Float
		pickup: Float
	}

	type ServiceType {
		id: ID!
		name: String!
		description: String
		category: String!
		isActive: Boolean!
		amount: AmountPerCarType!
		createdAt: String!
		updatedAt: String!
	}

	input AmountPerCarTypeInput {
		sedan: Float
		hatchback: Float
		crossover: Float
		suv: Float
		pickup: Float
	}

	input CreateServiceTypeInput {
		name: String!
		description: String
		category: String!
		isActive: Boolean
		amount: AmountPerCarTypeInput!
	}

	input UpdateServiceTypeInput {
		description: String
		isActive: Boolean
		amount: AmountPerCarTypeInput
	}

	extend type Query {
		services: BaseResponse!
		service(id: ID!): BaseResponse!
	}

	extend type Mutation {
		createServiceType(input: CreateServiceTypeInput!): BaseResponse!
		updateServiceType(id: ID!, input: UpdateServiceTypeInput!): BaseResponse!
	}
`;

module.exports = serviceTypeDefs;
