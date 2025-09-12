const { gql } = require('graphql-tag');

const partTypeDefs = gql`
	type PartImage {
		url: String!
		alt: String
	}

	type Part {
		id: ID!
		name: String!
		description: String
		category: String!
		brand: String!
		condition: String!
		unit: String!
		stock: Int!
		reorderLevel: Int
		price: Float!
		isActive: Boolean!
		supplier: String
		images: [PartImage!]
		createdAt: String!
		updatedAt: String!
	}

	input PartImageInput {
		url: String!
		alt: String
	}

	input CreatePartInput {
		name: String!
		description: String
		category: String!
		brand: String!
		condition: String
		unit: String
		stock: Int!
		reorderLevel: Int
		price: Float!
		isActive: Boolean
		supplier: String
		images: [PartImageInput!]
	}

	input UpdatePartInput {
		name: String
		description: String
		category: String
		brand: String
		condition: String
		unit: String
		stock: Int
		reorderLevel: Int
		price: Float
		isActive: Boolean
		supplier: String
		images: [PartImageInput!]
	}

	extend type Query {
		parts: BaseResponse!
		part(id: ID!): BaseResponse!
		lowStockParts: BaseResponse!
	}

	extend type Mutation {
		createPart(input: CreatePartInput!): BaseResponse!
		updatePart(id: ID!, input: UpdatePartInput!): BaseResponse!
		deletePart(id: ID!): BaseResponse!
		addStock(id: ID!, quantity: Int!): BaseResponse!
		consumeStock(id: ID!, quantity: Int!, jobOrderId: ID): BaseResponse!
	}
`;

module.exports = partTypeDefs;
