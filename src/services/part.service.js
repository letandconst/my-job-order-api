const Part = require('../models/Parts');
const partValidator = require('../validators/partValidator');

// Helper to fetch a part or throw
const getPartOrThrow = async (id) => {
	const part = await Part.findById(id);
	if (!part) throw new Error('Part not found');
	return part;
};

// Create a new part
const createPart = async (input) => {
	await partValidator.validate(input, { abortEarly: false, context: { mode: 'create' } });
	return Part.create(input);
};

// Update an existing part
const updatePart = async (id, input) => {
	await partValidator.validate(input, { abortEarly: false, context: { mode: 'update' } });
	const part = await Part.findByIdAndUpdate(id, input, { new: true });
	if (!part) throw new Error('Part not found');
	return part;
};

// Delete a part
const deletePart = async (id) => {
	const part = await Part.findByIdAndDelete(id);
	if (!part) throw new Error('Part not found');
	return part;
};

// Get all parts
const getParts = async () => Part.find();

// Get a part by ID
const getPartById = async (id) => getPartOrThrow(id);

// Get low stock parts
const getLowStockParts = async () => Part.find({ $expr: { $lte: ['$stock', '$reorderLevel'] } });

module.exports = {
	createPart,
	updatePart,
	deletePart,
	getParts,
	getPartById,
	getLowStockParts,
};
