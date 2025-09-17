const { gql } = require('graphql-tag');

const clientTypeDefs = gql`
	type Client {
		id: ID!
		name: String!
		address: String
		mobileNumber: String!
		birthday: String!
		cars: [Car!]!
		createdAt: String!
		updatedAt: String!
		lastService: String
		jobHistory: [JobOrder!]!
	}

	type Car {
		id: ID!
		model: String!
		plateNumber: String!
		year: String!
		createdAt: String!
		updatedAt: String!
	}

	input CarInput {
		model: String!
		plateNumber: String!
		year: String!
	}

	input CreateClientInput {
		name: String!
		address: String
		mobileNumber: String!
		birthday: String!
		cars: [CarInput!]!
	}

	input UpdateClientInput {
		clientId: ID!
		name: String
		address: String
		birthday: String
		mobileNumber: String
		cars: [CarInput!]
	}

	type Query {
		clients: BaseResponse!
		client(id: ID!): BaseResponse!
	}

	type Mutation {
		createClient(input: CreateClientInput!): BaseResponse!
		updateClient(input: UpdateClientInput!): BaseResponse!
	}
`;

module.exports = clientTypeDefs;
