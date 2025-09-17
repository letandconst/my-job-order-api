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

		return formatResponse(201, 'Service type created successfully', {
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

const updateServiceType = async (id, args) => {
	try {
		await updateServiceTypeSchema.validate(args);

		const serviceType = await ServiceType.findById(id);
		if (!serviceType) return formatResponse(404, 'Service type not found');

		if (args.description !== undefined) {
			serviceType.description = args.description;
		}

		if (args.isActive !== undefined) {
			serviceType.isActive = args.isActive;
		}

		if (args.amount !== undefined) {
			serviceType.amount = {
				...(serviceType.amount.toObject?.() ?? serviceType.amount),
				...args.amount,
			};
		}

		await serviceType.save();

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
