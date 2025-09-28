const { createStockTransaction, getAllStockTransactions } = require('../../services/stock.service');

const stockTransactionResolver = {
	Query: {
		stockTransactions: async () => {
			return await getAllStockTransactions();
		},
	},

	Mutation: {
		createStockTransaction: async (_, { input }, { user }) => {
			if (!user) throw new Error('Unauthorized');
			return await createStockTransaction(input, user.id);
		},
	},
};

module.exports = stockTransactionResolver;
