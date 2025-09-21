const Part = require('../models/Parts');
const partValidator = require('../validators/partValidator');
const { formatResponse } = require('../utils/response');

// Helper to fetch a part or return 404
const getPartOr404 = async (id) => {
	const part = await Part.findById(id);
	if (!part) throw new Error('404: Part not found');
	return part;
};

// Create a new part
const createPart = async (input) => {
	try {
		await partValidator.validate(input, { abortEarly: false, context: { mode: 'create' } });

		const part = await Part.create(input);
		return formatResponse(201, 'Part created successfully', part);
	} catch (err) {
		return formatResponse(err.message.startsWith('404:') ? 404 : 400, err.message || 'Failed to create part');
	}
};

// Update an existing part
const updatePart = async (id, input) => {
	try {
		await partValidator.validate(input, { abortEarly: false, context: { mode: 'update' } });

		const part = await Part.findByIdAndUpdate(id, input, { new: true });
		if (!part) return formatResponse(404, 'Part not found');
		return formatResponse(200, 'Part updated successfully', part);
	} catch (err) {
		return formatResponse(err.message.startsWith('404:') ? 404 : 400, err.message || 'Failed to update part');
	}
};

// Delete a part
const deletePart = async (id) => {
	try {
		const part = await Part.findByIdAndDelete(id);
		if (!part) return formatResponse(404, 'Part not found');
		return formatResponse(200, 'Part deleted successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to delete part');
	}
};

// Get all parts
const getParts = async () => {
	try {
		const parts = await Part.find();
		return formatResponse(200, 'Parts retrieved successfully', parts);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch parts');
	}
};

// Get a part by ID
const getPartById = async (id) => {
	try {
		const part = await getPartOr404(id);
		return formatResponse(200, 'Part retrieved successfully', part);
	} catch (err) {
		return formatResponse(err.message.startsWith('404:') ? 404 : 400, err.message || 'Failed to fetch part');
	}
};

// Add stock (atomic)
const addStock = async (id, quantity) => {
	try {
		const part = await Part.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true });

		if (!part) return formatResponse(404, 'Part not found');
		return formatResponse(200, 'Stock added successfully', part);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to add stock');
	}
};

// Consume stock (atomic with check)
const consumeStock = async (id, quantity, jobOrderId) => {
	try {
		const part = await Part.findOneAndUpdate({ _id: id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } }, { new: true });

		if (!part) {
			const exists = await Part.findById(id);
			if (!exists) return formatResponse(404, 'Part not found');
			return formatResponse(400, 'Not enough stock available');
		}

		return formatResponse(200, 'Stock consumed successfully', {
			part,
			jobOrderId,
		});
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to consume stock');
	}
};

// Optimized Batch Add Stock
const addStockBatch = async (updates) => {
	try {
		if (!updates || updates.length === 0) return formatResponse(400, 'No updates provided');

		const bulkOps = updates.map(({ id, quantity }) => ({
			updateOne: {
				filter: { _id: id },
				update: { $inc: { stock: quantity } },
			},
		}));

		const result = await Part.bulkWrite(bulkOps);

		return formatResponse(200, 'Batch stock update completed', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update batch stock');
	}
};

// Optimized Batch Consume Stock
const consumeStockBatch = async (updates, jobOrderId) => {
	try {
		if (!updates || updates.length === 0) return formatResponse(400, 'No updates provided');

		const bulkOps = updates.map(({ id, quantity }) => ({
			updateOne: {
				filter: { _id: id, stock: { $gte: quantity } }, // ensure enough stock
				update: { $inc: { stock: -quantity } },
			},
		}));

		await Part.bulkWrite(bulkOps);

		// Fetch final status for reporting
		const results = await Promise.all(
			updates.map(async ({ id, quantity }) => {
				const part = await Part.findById(id);
				if (!part) return { id, success: false, message: 'Part not found' };
				if (part.stock + quantity < quantity) return { id, success: false, message: 'Not enough stock' };
				return { id, success: true, part };
			})
		);

		return formatResponse(200, 'Batch stock consumption completed', {
			jobOrderId,
			results,
		});
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to consume batch stock');
	}
};

// Get low-stock parts
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
	addStockBatch,
	consumeStockBatch,
	getLowStockParts,
};
