const { gql } = require('graphql-tag');

const partTypeDefs = gql`
	scalar DateTime

	type Part {
		id: ID!
		name: String!
		description: String
		category: String!
		brand: String!
		condition: String
		unit: String
		stock: Int!
		reorderLevel: Int
		price: Float!
		isActive: Boolean!
		supplier: String
		images: [String]
		createdAt: String!
		updatedAt: String!
		lastTransactionAt: DateTime
	}

	input CreatePartInput {
		name: String!
		description: String
		category: String!
		brand: String!
		condition: String
		unit: String
		stock: Int
		reorderLevel: Int
		price: Float!
		isActive: Boolean
		supplier: String
		images: [String]
	}

	input UpdatePartInput {
		name: String
		description: String
		category: String
		brand: String
		condition: String
		unit: String
		reorderLevel: Int
		price: Float
		isActive: Boolean
		supplier: String
		images: [String]
	}

	extend type Query {
		parts: [Part!]!
		part(id: ID!): Part
		lowStockParts: [Part!]!
	}

	extend type Mutation {
		createPart(input: CreatePartInput!): Part!
		updatePart(id: ID!, input: UpdatePartInput!): Part!
		deletePart(id: ID!): Part!
	}
`;

module.exports = partTypeDefs;
