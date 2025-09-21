const mongoose = require('mongoose');

const jobOrderSchema = new mongoose.Schema(
	{
		client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
		car: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
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
		notes: [
			{
				message: { type: String, required: true },
				addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
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
