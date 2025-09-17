const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		category: { type: String, required: true },
		isActive: { type: Boolean, default: true },
		amount: {
			sedan: { type: Number, default: 0 },
			hatchback: { type: Number, default: 0 },
			crossover: { type: Number, default: 0 },
			suv: { type: Number, default: 0 },
			pickup: { type: Number, default: 0 },
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model('ServiceType', serviceTypeSchema);
