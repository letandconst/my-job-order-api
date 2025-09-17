const Client = require('../models/Client');
const clientValidator = require('../validators/clientValidator');
const { formatResponse } = require('../utils/response');
const JobOrder = require('../models/JobOrder');

// Create a new client
const createClient = async (input) => {
	try {
		await clientValidator.validate(input, { abortEarly: false });
		const client = await Client.create(input);
		return formatResponse(200, 'Client created successfully', client);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create client');
	}
};

// Update an existing client
const updateClient = async (input) => {
	const { clientId, ...updateData } = input;
	try {
		const client = await Client.findByIdAndUpdate(clientId, updateData, { new: true });
		if (!client) return formatResponse(404, 'Client not found');
		return formatResponse(200, 'Client updated successfully', client);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update client');
	}
};

// Get all clients
const getClients = async () => {
	try {
		const clients = await Client.find().lean();

		const clientFullView = await Promise.all(
			clients.map(async (client) => {
				const jobOrders = await JobOrder.find({ client: client._id }).populate('car').populate('assignedMechanic', 'name').populate('workRequested.service', 'name').sort({ createdAt: -1 });

				return {
					...client,
					lastService: jobOrders[0]?.createdAt || null,
					jobHistory: jobOrders,
				};
			})
		);

		return formatResponse(200, 'Clients fetched successfully', clientFullView);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch clients');
	}
};

// Get a client by ID
const getClientById = async (id) => {
	try {
		const client = await Client.findById(id);
		if (!client) return formatResponse(404, 'Client not found');
		return formatResponse(200, 'Client fetched successfully', client);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch client');
	}
};

module.exports = {
	createClient,
	updateClient,
	getClients,
	getClientById,
};
