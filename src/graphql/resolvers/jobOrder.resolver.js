const { getJobOrderById, getJobOrders, createJobOrder, updateJobOrder, updateJobOrderStatus } = require('../../services/jobOrder.service');

const jobOrderResolver = {
	Query: {
		jobOrders: () => getJobOrders(),
		jobOrder: (_, { id }) => getJobOrderById(_, { id }),
	},

	Mutation: {
		createJobOrder: (_, { input }) => createJobOrder(_, { input }),
		updateJobOrder: (_, { input }) => updateJobOrder(_, { input }),
		updateJobOrderStatus: (_, { input }) => updateJobOrderStatus(_, { input }),
	},
};

module.exports = jobOrderResolver;
