const { gql } = require('graphql-tag');

const jobOrderTypeDefs = gql`
	type JobOrder {
		id: ID!
		client: Client!
		car: Car!
		assignedMechanic: Mechanic!
		parts: [JobOrderPart!]!
		workRequested: [JobOrderService!]!
		totalLabor: Float!
		totalPartsPrice: Float!
		total: Float!
		status: String!
		history: [JobOrderHistory!]!
		createdAt: String!
		updatedAt: String!
		notes: [JobOrderNote!]
	}

	type JobOrderPart {
		part: Part!
		quantity: Int!
		price: Float! # snapshot at order time
	}

	type JobOrderService {
		service: ServiceType!
		price: Float! # snapshot at order time
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
		assignedMechanicId: ID!
		parts: [JobOrderPartInput]
		workRequested: [JobOrderServiceInput!]
	}

	input UpdateJobOrderInput {
		jobOrderId: ID!
		clientId: ID
		carId: ID
		assignedMechanicId: ID
		parts: [JobOrderPartInput!]
		workRequested: [JobOrderServiceInput!]
	}

	input UpdateJobOrderStatusInput {
		jobOrderId: ID!
		status: String!
		updatedBy: String
	}

	type Query {
		jobOrders: BaseResponse!
		jobOrder(id: ID!): BaseResponse!
	}

	type Mutation {
		createJobOrder(input: CreateJobOrderInput!): BaseResponse!
		updateJobOrder(input: UpdateJobOrderInput!): BaseResponse!
		updateJobOrderStatus(input: UpdateJobOrderStatusInput!): BaseResponse!
	}
`;

module.exports = jobOrderTypeDefs;
