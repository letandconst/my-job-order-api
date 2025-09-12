const { createMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic } = require('../../services/mechanic.service');

const mechanicResolvers = {
	Query: {
		listMechanics: async () => getMechanics(),
		listMechanic: async (_, { id }) => getMechanicById(id),
	},
	Mutation: {
		createMechanic: async (_, { input }) => createMechanic(input),
		updateMechanic: async (_, { id, ...args }) => updateMechanic(id, args),
		deleteMechanic: async (_, { id }) => deleteMechanic(id),
	},
};

module.exports = mechanicResolvers;
