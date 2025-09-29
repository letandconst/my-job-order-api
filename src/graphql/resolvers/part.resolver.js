const { createPart, updatePart, deletePart, getParts, getPartById, consumeStock, getLowStockParts } = require('../../services/part.service');

const partResolvers = {
	Query: {
		parts: () => getParts(),
		part: (_, { id }) => getPartById(id),
		lowStockParts: () => getLowStockParts(),
	},
	Mutation: {
		createPart: (_, { input }) => createPart(input),
		updatePart: (_, { id, input }) => updatePart(id, input),
		deletePart: (_, { id }) => deletePart(id),
	},
};

module.exports = partResolvers;
