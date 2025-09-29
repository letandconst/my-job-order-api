const ServiceType = require('../models/ServiceType');
const { serviceTypeSchema, updateServiceTypeSchema } = require('../validators/serviceTypeValidator');

// Create a new service type
const createServiceType = async (args) => {
	await serviceTypeSchema.validate(args);

	const existing = await ServiceType.findOne({
		name: args.name,
		category: args.category,
	});
	if (existing) throw new Error('A service type with this name and category already exists.');

	return ServiceType.create({
		name: args.name,
		description: args.description,
		category: args.category,
		isActive: args.isActive ?? true,
		amount: args.amount,
	});
};

// Get all service types
const getServiceTypes = async () => ServiceType.find();

// Get service type by ID
const getServiceTypeById = async (id) => {
	const serviceType = await ServiceType.findById(id);
	if (!serviceType) throw new Error('Service type not found');
	return serviceType;
};

// Update service type
const updateServiceType = async (input) => {
	const { serviceTypeId, ...updateData } = input;

	await updateServiceTypeSchema.validate(input);

	const serviceType = await ServiceType.findByIdAndUpdate(serviceTypeId, updateData, {
		new: true,
	});
	if (!serviceType) throw new Error('Service type not found');

	return serviceType;
};

module.exports = {
	createServiceType,
	getServiceTypes,
	getServiceTypeById,
	updateServiceType,
};
