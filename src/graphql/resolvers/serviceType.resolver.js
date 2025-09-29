const { createServiceType, getServiceTypes, updateServiceType, getServiceTypeById } = require('../../services/serviceType.service');

const serviceTypeResolvers = {
	Query: {
		services: () => getServiceTypes(),
		service: (_, { id }) => getServiceTypeById(id),
	},
	Mutation: {
		createServiceType: (_, { input }) => createServiceType(input),
		updateServiceType: (_, { input }) => updateServiceType(input),
	},
};

module.exports = serviceTypeResolvers;
