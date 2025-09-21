const StockTransaction = require('../models/StockTransaction');
const Part = require('../models/Parts');
const { createStockTransactionValidator } = require('../validators/stockValidator');
const formatResponse = require('../utils/response');

// Create stock transaction
const createStockTransaction = async (input, userId) => {
	try {
		await createStockTransactionValidator.validate({ ...input, createdBy: userId }, { abortEarly: false });

		// 1. Find part
		const part = await Part.findById(partId);
		if (!part) return formatResponse(404, 'Part not found');

		let newBalance = part.stock;

		// 2. Apply transaction logic
		if (type === 'IN') {
			newBalance += quantity;
		} else if (type === 'OUT') {
			if (part.stock < quantity) return formatResponse(400, 'Insufficient stock');
			newBalance -= quantity;
		} else if (type === 'ADJUSTMENT') {
			newBalance = quantity; // absolute reset
		}

		// 3. Create transaction log
		const transaction = await StockTransaction.create({
			part: partId,
			jobOrder: jobOrderId || null,
			type,
			quantity,
			balanceAfter: newBalance,
			reference,
			createdBy: userId,
		});

		// 4. Update part stock + last transaction time
		part.stock = newBalance;
		part.lastTransactionAt = new Date();
		await part.save();

		return formatResponse(201, 'Stock transaction created successfully', transaction);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create stock transaction');
	}
};

// Get all transactions
const getAllStockTransactions = async () => {
	try {
		const transactions = await StockTransaction.find().populate('part').populate('jobOrder').populate('createdBy').sort({ createdAt: -1 });

		return formatResponse(200, 'Stock transactions fetched successfully', transactions);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch stock transactions');
	}
};

// Get transactions by part
const getStockTransactionsByPart = async (partId) => {
	try {
		const transactions = await StockTransaction.find({ part: partId }).populate('part').populate('jobOrder').populate('createdBy').sort({ createdAt: -1 });

		return formatResponse(200, 'Stock transactions fetched successfully', transactions);
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to fetch stock transactions');
	}
};

module.exports = {
	createStockTransaction,
	getAllStockTransactions,
	getStockTransactionsByPart,
};
