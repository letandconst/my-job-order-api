const mongoose = require('mongoose');

const jobOrderSchema = new mongoose.Schema(
	{
		customerName: { type: String, required: true },
		address: String,
		carModel: { type: String, required: true },
		plateNumber: { type: String, required: true },
		mobileNumber: { type: String, required: true },

		assignedMechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },

		parts: [
			{
				part: { type: mongoose.Schema.Types.ObjectId, ref: 'Part' },
				quantity: { type: Number, required: true },
				price: { type: Number, required: true },
			},
		],

		workRequested: [
			{
				service: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType' },
				price: { type: Number, required: true },
			},
		],

		totalLabor: { type: Number, required: true },
		totalPartsPrice: { type: Number, required: true },
		total: { type: Number, required: true },

		status: {
			type: String,
			enum: ['pending', 'in_progress', 'completed'],
			default: 'pending',
		},

		history: [
			{
				status: String,
				updatedAt: { type: Date, default: Date.now },
				updatedBy: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('JobOrder', jobOrderSchema);
