const ServiceType = require('../models/ServiceType');
const { serviceTypeSchema, updateServiceTypeSchema } = require('../validators/serviceTypeValidator');
const { formatResponse } = require('../utils/response');

const createServiceType = async (args) => {
	try {
		await serviceTypeSchema.validate(args);

		const existing = await ServiceType.findOne({
			name: args.name,
			category: args.category,
		});
		if (existing) {
			return formatResponse(409, 'A service type with this name and category already exists.');
		}

		const serviceType = await ServiceType.create({
			name: args.name,
			description: args.description,
			category: args.category,
			isActive: args.isActive ?? true,
			amount: args.amount, // now object
		});

		return formatResponse(200, 'Service type created successfully', {
			serviceType,
		});
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create service type');
	}
};

const getServiceTypes = async () => {
	try {
		const serviceTypes = await ServiceType.find();
		return formatResponse(200, 'Service types retrieved successfully', serviceTypes);
	} catch (err) {
		return formatResponse(500, err.message || 'Failed to retrieve service types');
	}
};

const updateServiceType = async (input) => {
	try {
		const { serviceTypeId, ...updateData } = input;

		await updateServiceTypeSchema.validate(input);

		const serviceType = await ServiceType.findByIdAndUpdate(serviceTypeId, updateData, { new: true });
		if (!serviceType) return formatResponse(404, 'Service type not found');

		return formatResponse(200, 'Service type updated successfully', { serviceType });
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update service type');
	}
};

module.exports = {
	createServiceType,
	getServiceTypes,
	updateServiceType,
};
