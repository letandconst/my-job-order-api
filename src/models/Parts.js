const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		brand: {
			type: String,
			required: true,
			trim: true,
		},
		condition: {
			type: String,
			enum: ['new', 'used'],
			default: 'new',
		},
		unit: {
			type: String,
			default: 'pcs',
		},
		stock: {
			type: Number,
			required: function () {
				return this.isNew;
			},
			min: 0,
			default: 0,
		},
		reorderLevel: {
			type: Number,
			min: 0,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		supplier: {
			type: String,
			trim: true,
		},
		images: [
			{
				url: String,
				alt: String,
			},
		],
		lastTransactionAt: { type: Date, default: null },
	},
	{ timestamps: true }
);

partSchema.index({ stock: 1 });
partSchema.index({ category: 1, brand: 1 });

module.exports = mongoose.model('Part', partSchema);
