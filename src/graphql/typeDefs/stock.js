const { gql } = require('graphql-tag');

const stockTransactionTypeDef = gql`
	type StockTransaction {
		id: ID!
		part: Part!
		jobOrder: JobOrder
		type: String!
		quantity: Int!
		balanceAfter: Int!
		reference: String
		createdBy: User
		createdAt: String!
		updatedAt: String!
	}

	extend type Query {
		stockTransactions: [StockTransaction!]!
		stockTransactionsByPart(partId: ID!): [StockTransaction!]!
	}

	input CreateStockTransactionInput {
		partId: ID!
		jobOrderId: ID
		type: String!
		quantity: Int!
		reference: String
	}

	extend type Mutation {
		createStockTransaction(input: CreateStockTransactionInput!): StockTransaction!
	}
`;

module.exports = stockTransactionTypeDef;
