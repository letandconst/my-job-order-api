const { createServiceType, getServiceTypes, updateServiceType } = require('../../services/serviceType.service');

const serviceTypeResolvers = {
	Query: {
		services: async () => await getServiceTypes(),
	},
	Mutation: {
		createServiceType: async (_, { input }) => await createServiceType(input),
		updateServiceType: async (_, { id, ...args }) => await updateServiceType(id, args),
	},
};

module.exports = serviceTypeResolvers;
