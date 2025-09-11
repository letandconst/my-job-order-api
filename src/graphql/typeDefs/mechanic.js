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
		specialties: [String]
		dateJoined: String!
		createdAt: String!
		updatedAt: String!
	}

	type MechanicResponse {
		success: Boolean!
		message: String!
		mechanic: Mechanic
		mechanics: [Mechanic]
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
		specialties: [String]
		dateJoined: String
	}

	extend type Query {
		mechanics: MechanicResponse!
		mechanic(id: ID!): MechanicResponse!
	}

	extend type Mutation {
		createMechanic(input: CreateMechanicInput!): MechanicResponse!
		updateMechanic(id: ID!, name: String, address: String, phoneNumber: String, birthday: String, emergencyContactName: String, emergencyContactPhone: String, bio: String, avatar: String, specialties: [String]): MechanicResponse!
		deleteMechanic(id: ID!): MechanicResponse!
	}
`;

module.exports = mechanicTypeDefs;
