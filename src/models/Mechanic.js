const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		address: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		birthday: {
			type: Date,
			required: true,
		},
		emergencyContact: {
			name: { type: String, required: true },
			phoneNumber: { type: String, required: true },
		},
		bio: {
			type: String,
			default: '',
		},
		avatar: {
			type: String,
			default: null,
		},
		specialties: [
			{
				type: String,
			},
		],
		dateJoined: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Mechanic', mechanicSchema);
