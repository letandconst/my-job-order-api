const yup = require('yup');

// ---------------- STOCK TRANSACTION ----------------
const createStockTransactionValidator = yup.object({
	partId: yup.string().required('Part ID is required'),
	jobOrderId: yup.string().nullable().optional(), // may be null if manual adjustment
	type: yup.string().required('Transaction type is required').oneOf(['IN', 'OUT', 'ADJUSTMENT'], 'Invalid transaction type'),
	quantity: yup.number().required('Quantity is required').min(0, 'Quantity must be zero or greater'),
	reference: yup.string().optional(),
	createdBy: yup.string().optional(),
});

module.exports = {
	createStockTransactionValidator,
};
