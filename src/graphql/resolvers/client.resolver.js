const { getClients, getClientById, createClient, updateClient } = require('../../services/client.service');

const clientResolvers = {
	Query: {
		clients: () => getClients(),
		client: (_, { id }) => getClientById(_, { id }),
	},

	Mutation: {
		createClient: (_, { input }) => createClient(_, { input }),
		updateClient: (_, { input }) => updateClient(_, { input }),
	},
};

module.exports = clientResolvers;
