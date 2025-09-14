const { getJobOrderReport } = require('../../services/report.service');
const { formatResponse } = require('../../utils/response');

const reportResolvers = {
	Query: {
		jobOrderReport: async (_, { period = null, mechanicId = null, serviceType = null }) => {
			try {
				const report = await getJobOrderReport({ period, mechanicId, serviceType });
				return formatResponse(200, 'Report retrieved successfully', { report });
			} catch (err) {
				return formatResponse(400, err.message || 'Failed to fetch report.');
			}
		},
	},
};

module.exports = reportResolvers;
