const { createMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic } = require('../../services/mechanic.service');

const mechanicResolvers = {
	Query: {
		mechanics: async () => getMechanics(),
		mechanic: async (_, { id }) => getMechanicById(id),
	},
	Mutation: {
		createMechanic: async (_, { input }) => createMechanic(input),
		updateMechanic: async (_, { input }) => updateMechanic(input),
		deleteMechanic: async (_, { id }) => deleteMechanic(id),
	},
};

module.exports = mechanicResolvers;
