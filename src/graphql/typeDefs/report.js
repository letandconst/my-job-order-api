const { gql } = require('graphql-tag');

const reportTypeDefs = gql`
	type MechanicPerformance {
		mechanicName: String
		totalJobs: Int
	}

	type PartTrend {
		year: Int
		month: Int
		partName: String
		totalUsed: Int
	}

	type ReportSummary {
		totalOrders: Int
		completedOrders: Int
		pendingOrders: Int
		revenue: Float
		topMechanics: [MechanicPerformance!]
		partTrends: [PartTrend!]
	}

	extend type Query {
		jobOrderReport(period: String, mechanicId: ID, serviceType: String): BaseResponse
	}
`;

module.exports = reportTypeDefs;
