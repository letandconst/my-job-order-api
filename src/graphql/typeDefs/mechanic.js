const { gql } = require('graphql-tag');

const mechanicTypeDefs = gql`
	type EmergencyContact {
		name: String!
		phoneNumber: String!
	}

	type Mechanic {
		id: ID!
		name: String!
		address: String!
		phoneNumber: String!
		birthday: String!
		emergencyContact: EmergencyContact!
		bio: String
		avatar: String
		specialties: [String!]
		dateJoined: String!
		createdAt: String!
		updatedAt: String!
	}

	input CreateMechanicInput {
		name: String!
		address: String!
		phoneNumber: String!
		birthday: String!
		emergencyContactName: String!
		emergencyContactPhone: String!
		bio: String
		avatar: String
		specialties: [String!]
		dateJoined: String
	}

	input UpdateMechanicInput {
		id: ID!
		name: String
		address: String
		phoneNumber: String
		birthday: String
		emergencyContactName: String
		emergencyContactPhone: String
		bio: String
		avatar: String
		specialties: [String!]
		dateJoined: String
	}

	extend type Query {
		mechanics: [Mechanic!]!
		mechanic(id: ID!): Mechanic
	}

	extend type Mutation {
		createMechanic(input: CreateMechanicInput!): Mechanic!
		updateMechanic(input: UpdateMechanicInput!): Mechanic!
		deleteMechanic(id: ID!): Boolean!
	}
`;

module.exports = mechanicTypeDefs;
