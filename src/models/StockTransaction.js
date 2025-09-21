// models/StockTransaction.js
const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema(
	{
		part: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Part',
			required: true,
		},
		jobOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'JobOrder',
		},
		type: {
			type: String,
			enum: ['IN', 'OUT', 'ADJUSTMENT'],
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: 0,
		},
		balanceAfter: {
			type: Number,
			required: true,
		},
		reference: {
			type: String,
			trim: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
