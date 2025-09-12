const { createServiceType, getServiceTypes, getServiceTypeById, updateServiceType, deleteServiceType } = require('../../services/serviceType.service');

const serviceTypeResolvers = {
	Query: {
		services: async () => await getServiceTypes(),
		service: async (_, { id }) => await getServiceTypeById(id),
	},
	Mutation: {
		createServiceType: async (_, { input }) => await createServiceType(input),
		updateServiceType: async (_, { id, ...args }) => await updateServiceType(id, args),
		deleteServiceType: async (_, { id }) => await deleteServiceType(id),
	},
};

module.exports = serviceTypeResolvers;
