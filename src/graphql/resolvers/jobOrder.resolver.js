const { getJobOrderById, getJobOrders, createJobOrder, updateJobOrder, updateJobOrderStatus } = require('../../services/jobOrder.service');

const jobOrderResolver = {
	Query: {
		jobOrders: async () => getJobOrders(),
		jobOrder: async (_, { id }) => getJobOrderById(id),
	},
	Mutation: {
		createJobOrder: async (_, { input }) => createJobOrder(input),
		updateJobOrder: async (_, { input }) => updateJobOrder(input),
		updateJobOrderStatus: async (_, { input }) => updateJobOrderStatus(input),
	},
};

module.exports = jobOrderResolver;
