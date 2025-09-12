const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema(
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
		isActive: {
			type: Boolean,
			default: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ServiceType', serviceTypeSchema);
