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

	extend type Query {
		listMechanics: BaseResponse!
		listMechanic(id: ID!): BaseResponse!
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

	extend type Mutation {
		createMechanic(input: CreateMechanicInput!): BaseResponse!
		updateMechanic(id: ID!, name: String, address: String, phoneNumber: String, birthday: String, emergencyContactName: String, emergencyContactPhone: String, bio: String, avatar: String, specialties: [String], dateJoined: String): BaseResponse!
		deleteMechanic(id: ID!): BaseResponse!
	}
`;

module.exports = mechanicTypeDefs;
