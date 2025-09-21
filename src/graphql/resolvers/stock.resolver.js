const { createTransaction, getTransactionsByPart, getAllTransactions } = require('../../services/stock.service');

const stockTransactionResolver = {
	Query: {
		stockTransactions: async () => {
			return getAllTransactions();
		},
		stockTransactionsByPart: async (_, { partId }) => {
			return getTransactionsByPart(partId);
		},
	},

	Mutation: {
		createStockTransaction: async (_, { input }, { user }) => {
			if (!user) {
				throw new GraphQLError('Session expired.', {
					extensions: {
						code: ApolloServerErrorCode.AUTHENTICATION_FAILED,
					},
				});
			}

			return createTransaction({
				partId: input.partId,
				jobOrderId: input.jobOrderId,
				type: input.type,
				quantity: input.quantity,
				reference: input.reference,
				userId: user.id,
			});
		},
	},
};

module.exports = stockTransactionResolver;
