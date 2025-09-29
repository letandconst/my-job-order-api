const { createPart, updatePart, deletePart, getParts, getPartById, consumeStock, getLowStockParts } = require('../../services/part.service');

const partResolvers = {
	Query: {
		parts: async () => getParts(),
		part: async (_, { id }) => getPartById(id),
		lowStockParts: async () => getLowStockParts(),
	},
	Mutation: {
		createPart: async (_, { input }) => createPart(input),
		updatePart: async (_, { id, input }) => updatePart(id, input),
		deletePart: async (_, { id }) => deletePart(id),
	},
};

module.exports = partResolvers;
