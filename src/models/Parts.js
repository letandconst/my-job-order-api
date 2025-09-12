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
		},
		brand: {
			type: String,
			required: true,
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
			required: true,
			min: 0,
		},
		reorderLevel: {
			type: Number,
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
		},
		supplier: {
			type: String,
		},
		images: [
			{
				url: String,
				alt: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Part', partSchema);
