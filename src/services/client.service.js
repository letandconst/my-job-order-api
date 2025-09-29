const Client = require('../models/Client');
const clientValidator = require('../validators/clientValidator');
const JobOrder = require('../models/JobOrder');

// Create a new client
const createClient = async (_, { input }) => {
	try {
		await clientValidator.validate(input, { abortEarly: false });
		const client = await Client.create(input);
		return client.toObject();
	} catch (err) {
		throw new Error(err.message || 'Failed to create client');
	}
};

// Update an existing client
const updateClient = async (_, { input }) => {
	const { clientId, ...updateData } = input;
	try {
		const client = await Client.findByIdAndUpdate(clientId, updateData, { new: true }).lean();
		if (!client) {
			throw new Error('Client not found');
		}
		return client;
	} catch (err) {
		throw new Error(err.message || 'Failed to update client');
	}
};

// Get all clients
const getClients = async () => {
	try {
		const clients = await Client.find().lean();

		return Promise.all(
			clients.map(async (client) => {
				const jobOrders = await JobOrder.find({ client: client._id }).populate('car').populate('assignedMechanic', 'name').populate('workRequested.service', 'name').sort({ createdAt: -1 }).lean();

				return {
					...client,
					lastService: jobOrders[0]?.createdAt || null,
					jobHistory: jobOrders,
				};
			})
		);
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch clients');
	}
};

// Get a client by ID
const getClientById = async (_, { id }) => {
	try {
		const client = await Client.findById(id).lean();
		if (!client) {
			throw new Error('Client not found');
		}

		const jobOrders = await JobOrder.find({ client: client._id }).populate('car').populate('assignedMechanic', 'name').populate('workRequested.service', 'name').sort({ createdAt: -1 }).lean();

		return {
			...client,
			lastService: jobOrders[0]?.createdAt || null,
			jobHistory: jobOrders,
		};
	} catch (err) {
		throw new Error(err.message || 'Failed to fetch client');
	}
};

module.exports = {
	createClient,
	updateClient,
	getClients,
	getClientById,
};
