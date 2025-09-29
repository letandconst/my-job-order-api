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
		jobHistory: [JobOrder!]
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
		clients: [Client!]!
		client(id: ID!): Client
	}

	type Mutation {
		createClient(input: CreateClientInput!): Client!
		updateClient(input: UpdateClientInput!): Client!
	}
`;

module.exports = clientTypeDefs;
