const { getJobOrderReport } = require('../../services/report.service');

const reportResolvers = {
	Query: {
		jobOrderReport: (_, { period = null, mechanicId = null, serviceType = null }) => getJobOrderReport({ period, mechanicId, serviceType }),
	},
};

module.exports = reportResolvers;
