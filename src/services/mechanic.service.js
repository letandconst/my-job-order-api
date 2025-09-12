const Mechanic = require('../models/Mechanic');
const { mechanicSchema, updateMechanicSchema } = require('../validators/mechanicValidator');
const { formatResponse } = require('../utils/response');

const createMechanic = async (args) => {
	try {
		await mechanicSchema.validate(args);

		const existingMechanic = await Mechanic.findOne({
			name: args.name,
			birthday: args.birthday,
		});

		if (existingMechanic) {
			return formatResponse(409, 'A mechanic with this details already exists.');
		}

		const mechanic = await Mechanic.create({
			name: args.name,
			address: args.address,
			phoneNumber: args.phoneNumber,
			birthday: args.birthday,
			emergencyContact: {
				name: args.emergencyContactName,
				phoneNumber: args.emergencyContactPhone,
			},
			bio: args.bio,
			avatar: args.avatar,
			specialties: args.specialties,
			dateJoined: args.dateJoined || Date.now(),
		});

		await mechanic.save();
		return formatResponse(201, 'Mechanic created successfully.', { mechanic });
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to create mechanic.');
	}
};

const getMechanics = async () => {
	try {
		const mechanics = await Mechanic.find();
		return formatResponse(200, 'Mechanics retrieved successfully.', { mechanics });
	} catch (err) {
		return formatResponse(500, err.message || 'Failed to fetch mechanics.');
	}
};

const getMechanicById = async (id) => {
	try {
		const mechanic = await Mechanic.findById(id);
		if (!mechanic) {
			return formatResponse(404, 'Mechanic not found.');
		}
		return formatResponse(200, 'Mechanic retrieved successfully.', { mechanic });
	} catch (err) {
		return formatResponse(500, err.message || 'Failed to fetch mechanic.');
	}
};

const updateMechanic = async (id, args) => {
	try {
		await updateMechanicSchema.validate(args);

		const mechanic = await Mechanic.findById(id);
		if (!mechanic) {
			return formatResponse(404, 'Mechanic not found.');
		}

		// Check for duplicate (name + birthday)
		if ((args.name || args.birthday) && (args.name !== mechanic.name || args.birthday !== mechanic.birthday)) {
			const duplicate = await Mechanic.findOne({
				name: args.name || mechanic.name,
				birthday: args.birthday || mechanic.birthday,
				_id: { $ne: id },
			});
			if (duplicate) {
				return formatResponse(409, 'Another mechanic with this details already exists.');
			}
		}

		const mutableFields = ['name', 'address', 'phoneNumber', 'bio', 'avatar', 'specialties', 'dateJoined'];

		mutableFields.forEach((field) => {
			if (args[field] !== undefined) mechanic[field] = args[field];
		});

		if (args.emergencyContactName !== undefined) mechanic.emergencyContact.name = args.emergencyContactName;
		if (args.emergencyContactPhone !== undefined) mechanic.emergencyContact.phoneNumber = args.emergencyContactPhone;

		await mechanic.save();

		return formatResponse(200, 'Mechanic updated successfully.', { mechanic });
	} catch (err) {
		return formatResponse(400, err.message || 'Failed to update mechanic.');
	}
};

const deleteMechanic = async (id) => {
	try {
		const mechanic = await Mechanic.findByIdAndDelete(id);
		if (!mechanic) {
			return formatResponse(404, 'Mechanic not found.');
		}
		return formatResponse(200, 'Mechanic deleted successfully.', { mechanic });
	} catch (err) {
		return formatResponse(500, err.message || 'Failed to delete mechanic.');
	}
};

module.exports = {
	createMechanic,
	getMechanics,
	getMechanicById,
	updateMechanic,
	deleteMechanic,
};
