const { gql } = require('graphql-tag');

const jobOrderTypeDefs = gql`
	type JobOrder {
		id: ID!
		client: Client!
		car: Car!
		assignedMechanic: Mechanic
		parts: [JobOrderPart]
		workRequested: [JobOrderService]
		totalLabor: Float
		totalPartsPrice: Float
		total: Float
		status: String!
		history: [JobOrderHistory]
		createdAt: String!
		updatedAt: String!
		notes: [JobOrderNote]
	}

	type JobOrderPart {
		part: Part
		quantity: Int!
		price: Float!
	}

	type JobOrderService {
		service: ServiceType
		price: Float!
	}

	type JobOrderNote {
		message: String!
		addedBy: String!
		createdAt: String!
	}

	type JobOrderHistory {
		status: String!
		updatedAt: String!
		updatedBy: String
	}

	input JobOrderPartInput {
		partId: ID!
		quantity: Int!
	}

	input JobOrderServiceInput {
		serviceId: ID!
	}

	input CreateJobOrderInput {
		clientId: ID!
		carId: ID!
		assignedMechanicId: ID
		parts: [JobOrderPartInput]
		workRequested: [JobOrderServiceInput]
	}

	input UpdateJobOrderInput {
		jobOrderId: ID!
		clientId: ID
		carId: ID
		assignedMechanicId: ID
		parts: [JobOrderPartInput]
		workRequested: [JobOrderServiceInput]
	}

	input UpdateJobOrderStatusInput {
		jobOrderId: ID!
		status: String!
		updatedBy: String
	}

	type Query {
		jobOrders: [JobOrder!]!
		jobOrder(id: ID!): JobOrder
	}

	type Mutation {
		createJobOrder(input: CreateJobOrderInput!): JobOrder!
		updateJobOrder(input: UpdateJobOrderInput!): JobOrder!
		updateJobOrderStatus(input: UpdateJobOrderStatusInput!): JobOrder!
	}
`;

module.exports = jobOrderTypeDefs;
