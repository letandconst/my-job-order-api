const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
	{
		model: { type: String, required: true },
		year: { type: String, required: true },
		plateNumber: { type: String, required: true },
	},
	{ timestamps: true }
);

const ClientSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { type: String },
		birthday: {
			type: Date,
			required: true,
		},
		mobileNumber: { type: String, required: true },
		cars: [CarSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Client', ClientSchema);
