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
		serviceTypeId: ID!
		description: String
		isActive: Boolean
		category: String
		amount: AmountPerCarTypeInput
	}

	extend type Query {
		services: [ServiceType!]!
		service(id: ID!): ServiceType
	}

	extend type Mutation {
		createServiceType(input: CreateServiceTypeInput!): ServiceType!
		updateServiceType(input: UpdateServiceTypeInput!): ServiceType!
	}
`;

module.exports = serviceTypeDefs;
