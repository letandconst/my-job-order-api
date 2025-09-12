const { createPart, updatePart, deletePart, getParts, getPartById, addStock, consumeStock, getLowStockParts } = require('../../services/part.service');

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
		addStock: async (_, { id, quantity }) => addStock(id, quantity),
		consumeStock: async (_, { id, quantity, jobOrderId }) => consumeStock(id, quantity, jobOrderId),
	},
};

module.exports = partResolvers;
