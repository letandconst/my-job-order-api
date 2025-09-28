const { createStockTransactionValidator } = require('../validators/stockValidator');
const { Part } = require('../models/Parts');
const StockTransaction = require('../models/StockTransaction');

const createStockTransaction = async (input, userId) => {
	try {
		await createStockTransactionValidator.validate({ ...input, createdBy: userId }, { abortEarly: false });

		const { partId, jobOrderId, type, quantity, reference } = input;

		//  Find part
		const part = await Part.findById(partId);
		if (!part) throw new Error('Part not found');

		//  Calculate new balance
		let newBalance = part.stock;

		if (type === 'IN') {
			newBalance += quantity;
		} else if (type === 'OUT') {
			if (part.stock < quantity) throw new Error('Insufficient stock');
			newBalance -= quantity;
		} else if (type === 'ADJUSTMENT') {
			newBalance = quantity;
		}

		//  Create transaction log
		const transaction = await StockTransaction.create({
			part: partId,
			jobOrder: jobOrderId,
			type,
			quantity,
			balanceAfter: newBalance,
			reference,
			createdBy: userId,
		});

		//  Update part stock + last transaction
		part.stock = newBalance;
		part.lastTransactionAt = new Date();
		await part.save();

		return transaction;
	} catch (err) {
		throw err;
	}
};

// Get all transactions
const getAllStockTransactions = async () => {
	const transactions = await StockTransaction.find().populate('part').populate('jobOrder').populate('createdBy').sort({ createdAt: -1 });

	return transactions;
};

module.exports = {
	createStockTransaction,
	getAllStockTransactions,
};
