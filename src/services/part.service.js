const Part = require('../models/Parts');
const partValidator = require('../validators/partValidator');
const { formatResponse } = require('../utils/response');

const createPart = async (input) => {
	try {
		await partValidator.validate(input, { abortEarly: false });
		const part = await Part.create(input);
		return formatResponse(201, 'Part created successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create part');
	}
};

const updatePart = async (id, input) => {
	try {
		const part = await Part.findByIdAndUpdate(id, input, { new: true });
		if (!part) {
			return formatResponse(404, 'Part not found');
		}
		return formatResponse(200, 'Part updated successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update part');
	}
};

const deletePart = async (id) => {
	try {
		const part = await Part.findByIdAndDelete(id);
		if (!part) {
			return formatResponse(404, 'Part not found');
		}
		return formatResponse(200, 'Part deleted successfully');
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to delete part');
	}
};

const getParts = async () => {
	try {
		const parts = await Part.find();
		return formatResponse(200, 'Parts retrieved successfully', parts);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch parts');
	}
};

const getPartById = async (id) => {
	try {
		const part = await Part.findById(id);
		if (!part) {
			return formatResponse(404, 'Part not found');
		}
		return formatResponse(200, 'Part retrieved successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch part');
	}
};

const addStock = async (id, quantity) => {
	try {
		const part = await Part.findById(id);
		if (!part) {
			return formatResponse(404, 'Part not found');
		}
		part.stock += quantity;
		await part.save();
		return formatResponse(200, 'Stock added successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to add stock');
	}
};

const consumeStock = async (id, quantity, jobOrderId) => {
	try {
		const part = await Part.findById(id);
		if (!part) {
			return formatResponse(404, 'Part not found');
		}
		if (part.stock < quantity) {
			return formatResponse(400, 'Not enough stock available');
		}
		part.stock -= quantity;
		await part.save();
		return formatResponse(200, 'Stock consumed successfully', {
			part,
			jobOrderId,
		});
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to consume stock');
	}
};

const getLowStockParts = async () => {
	try {
		const parts = await Part.find({ $expr: { $lte: ['$stock', '$reorderLevel'] } });
		if (!parts || parts.length === 0) {
			return formatResponse(200, 'No parts are currently low in stock', []);
		}
		return formatResponse(200, 'Low stock parts retrieved successfully', parts);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch low stock parts');
	}
};

module.exports = {
	createPart,
	updatePart,
	deletePart,
	getParts,
	getPartById,
	addStock,
	consumeStock,
	getLowStockParts,
};
