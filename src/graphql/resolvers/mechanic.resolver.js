const { createMechanic, getMechanics, getMechanicById, updateMechanic, deleteMechanic } = require('../../services/mechanic.service');

const mechanicResolvers = {
	Query: {
		mechanics: () => getMechanics(),
		mechanic: (_, { id }) => getMechanicById(id),
	},
	Mutation: {
		createMechanic: (_, { input }) => createMechanic(input),
		updateMechanic: (_, { input }) => updateMechanic(input),
		deleteMechanic: (_, { id }) => deleteMechanic(id),
	},
};

module.exports = mechanicResolvers;
