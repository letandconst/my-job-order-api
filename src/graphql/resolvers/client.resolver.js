const { getClients, getClientById, createClient, updateClient } = require('../../services/client.service');

const clientResolvers = {
	Query: {
		clients: async () => {
			return await getClients();
		},
		client: async (_, { id }) => {
			return await getClientById(id);
		},
	},

	Mutation: {
		createClient: async (_, { input }) => {
			return await createClient(input);
		},
		updateClient: async (_, { input }) => {
			return await updateClient(input);
		},
	},
};

module.exports = clientResolvers;
